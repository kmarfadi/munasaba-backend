import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    join(__dirname, '../modules/**/entities/*.entity{.ts,.js}'),
    join(__dirname, '../modules/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  // Enhanced connection pooling with latest options
  extra: {
    max: 20, // Maximum connections in pool
    min: 5,  // Minimum connections in pool
    acquire: 30000, // Maximum time to get connection
    idle: 10000,    // Maximum time connection can be idle
    evict: 1000,    // How often to check for idle connections
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
});
