import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';

export class TeacherSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const teacherRepository: Repository<Teacher> =
      dataSource.getRepository(Teacher);

    const teachers: Teacher[] = [
      { email: 'teacherken@gmail.com' },
      { email: 'teacherjoe@gmail.com' },
    ];

    await teacherRepository.save(teachers);
  }
}