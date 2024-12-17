import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { Teacher } from '@/entities/teacher.entity';

export class TeacherSeeder implements Seeder {
  track: true;
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const placeFactory: SeederFactory<Teacher, unknown> =
      factoryManager.get(Teacher);

    const teacherRepository: Repository<Teacher> =
      dataSource.getRepository(Teacher);
    const teacherEmails = [
      'teacherken@gmail.com',
      'teacherjoe@gmail.com',
    ];
    const teachers: Teacher[] = await Promise.all(
      teacherEmails
        .map(async (email) => {
          return await placeFactory.make({ email });
        }),
    );
    await teacherRepository.save(teachers);
  }
}