import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Teacher } from '@/entities/teacher.entity';

export class TeacherSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const teacherRepository: Repository<Teacher> =
      dataSource.getRepository(Teacher);

    const count = await teacherRepository.count();
    if (count > 0) return;

    const teachers: Teacher[] = [
      { email: 'teacherken@gmail.com' },
      { email: 'teacherjoe@gmail.com' },
    ];

    await teacherRepository.save(teachers);
  }
}
