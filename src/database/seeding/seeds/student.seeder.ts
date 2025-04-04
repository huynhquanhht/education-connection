import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Student } from '@/entities/student.entity';

export class StudentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const studentRepository: Repository<Student> =
      dataSource.getRepository(Student);

    const count = await studentRepository.count();
    if (count > 0) return;

    const students: Student[] = [
      { email: 'studentjon@gmail.com', isSuspended: true },
      { email: 'studenthon@gmail.com', isSuspended: false },
      { email: 'student_only_under_teacher_ken@gmail.com', isSuspended: false },
      { email: 'commonstudent1@gmail.com', isSuspended: false },
      { email: 'commonstudent2@gmail.com', isSuspended: false },
      { email: 'studentmary@gmail.com', isSuspended: false },
    ];

    await studentRepository.save(students);
  }
}
