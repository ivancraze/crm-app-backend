import { DataSourceOptions } from 'typeorm';
export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'crmappuser',
  password: 'pass',
  database: 'crmdb',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
