import { DataSource } from 'typeorm';
import { Room, User } from '../entities/index.js';

function getSSLConfig(env: string) {
  const configs: { [key: string]: boolean | { [key: string]: boolean } } = {
    production: { rejectUnauthorized: true },
    local: false,
    deploy: { rejectUnauthorized: false }
  };
  if (!configs[env] === undefined) {
    throw new Error('Set network in your .env file');
  }
  return configs[env];
}

export const appDataSource = new DataSource({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  logging: ['query', 'error'],
  type: 'postgres',
  entities: [Room, User],
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: getSSLConfig(process.env.SERVER_MODE as string),
  synchronize: true
});