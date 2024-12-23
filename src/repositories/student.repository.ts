import { Injectable } from '@nestjs/common';
import { Student } from '@/entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  getCommonStudents(teachers: Teacher[]): Promise<Student[]> {
    const subQuery: any = this.dataSource
      .createQueryBuilder()
      .select('ts.student_id')
      .from(TeacherStudent, 'ts')
      .where(`ts.teacher_id IN (:teacherIds)`, {
        teacherIds: teachers.map((t) => t.id),
      })
      .groupBy('ts.student_id')
      .having(`COUNT(ts.student_id) = :count`, { count: teachers.length });
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(Student, 's')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'subQuery',
        'subQuery.student_id = s.id',
      )
      .setParameters(subQuery.getParameters())
      .execute();
  }

  retrieveForNotifications(
    teacherId: number,
    mentionedStudents: string[],
  ): Promise<Student[]> {
    return this.dataSource
      .createQueryBuilder()
      .select(['s.id', 's.email'])
      .from(Student, 's')
      .leftJoin('teacher_student', 'ts', 'ts.student_id = s.id')
      .where('s.is_suspended is false')
      .andWhere('(s.email in (:emails) OR ts.teacher_id = :teacherId )', {
        emails: mentionedStudents,
        teacherId: teacherId,
      })
      .getMany();
  }
}
