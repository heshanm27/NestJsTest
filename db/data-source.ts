import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nestjs',
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migration/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
