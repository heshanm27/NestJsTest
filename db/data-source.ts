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

console.log(
  'dataSourceOptions',
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  __dirname + '/dist/src/**/*.entity.js',
);
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
