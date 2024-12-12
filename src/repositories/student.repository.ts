import { Injectable } from '@nestjs/common';
import { Student } from '@/entities/student.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  getByEmail(email: string): Promise<Student> {
    return this.findOne({
      where: { email },
    });
  }

  getByEmails(emails: string[]): Promise<Student[]> {
    return this.findBy({ email: In(emails) });
  }

  suspendStudent(student: Student) {
    this.dataSource
      .createQueryBuilder()
      .from(Student, 's')
      .update()
      .set({ isSuspended: true })
      .where({ id: student.id })
      .execute();
  }

  getCommonStudents(listTeacher: Teacher[]): Promise<Student[]> {
    const createSubQuery = (sub: any) =>
      sub
        .select('ts.student_id')
        .from(TeacherStudent, 'ts')
        .where(`ts.teacher_id IN (${listTeacher.map((t) => t.id).join(',')})`)
        .groupBy('ts.student_id')
        .having(`COUNT(ts.student_id) = ${listTeacher.length}`);
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(Student, 's')
      .innerJoin(
        (sub) => createSubQuery(sub),
        'subQuery',
        'subQuery.student_id = s.id',
      )
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
      .andWhere('(s.email in (:...emails) OR ts.teacher_id = :teacherId )', {
        emails: [mentionedStudents],
        teacherId: teacherId,
      })
      .getMany();
  }
}
