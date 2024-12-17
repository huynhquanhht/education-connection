import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Class } from '@/entities/class.entity';

export class ClassSeeder implements Seeder {
  track: true;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const classRepository = dataSource.getRepository(Class);

    const classes: Class[] = [
      {
        name: '18T1',
      },
      {
        name: '18T2',
      },
    ];
    await classRepository.save(classes);
  }
}
