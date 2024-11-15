import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  getByEmail(email: string): Promise<Teacher> {
    return this.findOne({
      where: { email },
    });
  }

  getByEmails(emails: string[]): Promise<Teacher[]> {
    return this.find({ where: { email: In(emails) } });
  }
}
