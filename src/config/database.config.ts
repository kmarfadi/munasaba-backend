import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'munasaba',
  entities: [
    join(__dirname, '../modules/auth/entities/*.entity{.ts,.js}'),
    join(__dirname, '../modules/events/entities/*.entity{.ts,.js}'),
    join(__dirname, '../modules/guests/entities/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
