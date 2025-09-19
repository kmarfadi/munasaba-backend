const { DataSource } = require('typeorm');
const { config } = require('dotenv');
const path = require('path');

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'munasaba',
  entities: [
    path.join(__dirname, 'dist/modules/auth/entities/*.entity.js'),
    path.join(__dirname, 'dist/modules/events/entities/*.entity.js'),
    path.join(__dirname, 'dist/modules/guests/entities/*.entity.js'),
  ],
  migrations: [path.join(__dirname, 'dist/database/migrations/*.js')],
  synchronize: false,
  logging: true,
});

module.exports = AppDataSource;
