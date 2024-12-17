import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { Student } from '@/entities/student.entity';

export class StudentSeeder implements Seeder {
  track: true;
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const placeFactory: SeederFactory<Student, unknown> =
      factoryManager.get(Student);

    const studentRepository: Repository<Student> =
      dataSource.getRepository(Student);
    const students: Student[] = [
      { email: 'studentjon@gmail.com', isSuspended: true },
      { email: 'studenthon@gmail.com', isSuspended: false },
      { email: 'student_only_under_teacher_ken@gmail.com', isSuspended: false },
      { email: 'commonstudent1@gmail.com', isSuspended: false },
      { email: 'commonstudent2@gmail.com', isSuspended: false },
      { email: 'studentmary@gmail.com', isSuspended: false }
    ]
    const studentData: Student[] = await Promise.all(
      students
        .map(async (student: Student) => {
          return await placeFactory.make(student);
        }),
    );
    await studentRepository.save(studentData);
  }
}