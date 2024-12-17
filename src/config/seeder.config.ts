import { DataSourceOptions, DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { typeOrmConfig } from './database.config';

const options: DataSourceOptions & SeederOptions = {
  ...(typeOrmConfig as DataSourceOptions),
  seeds: ['src/database/seeding/seeds/*.seeder{.ts,.js}'],
  seedTracking: false,
};

const dataSource = new DataSource(options);

export default dataSource;