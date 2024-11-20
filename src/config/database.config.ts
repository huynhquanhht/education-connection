import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_MYSQL,
  port: +process.env.DB_PORT_MYSQL || 3306,
  database: process.env.DB_NAME_MYSQL,
  username: process.env.DB_USERNAME_MYSQL,
  password: process.env.DB_PASSWORD_MYSQL,
  entities: [join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'database/migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);
export default dataSource;

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => typeOrmConfig,
};
