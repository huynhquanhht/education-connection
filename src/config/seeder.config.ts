import { DataSourceOptions, DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { typeOrmConfig } from './database.config';

const options: DataSourceOptions & SeederOptions = {
  ...(typeOrmConfig as DataSourceOptions),
  factories: ['src/database/seeding/factories/*.factory{.ts,.js}'],
  seeds: ['src/database/seeding/seeds/*.seeder{.ts,.js}'],
  seedTracking: true,
};

const dataSource = new DataSource(options);

export default dataSource;