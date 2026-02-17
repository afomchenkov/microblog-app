import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';

const isProduction = process.env.NODE_ENV === 'production';
const databasePath = isProduction
  ? join(__dirname, 'data', 'microblog.db')
  : join(process.cwd(), 'data', 'microblog.db');

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: databasePath,
  entities: [User, Post],
  migrations: [join(process.cwd(), 'dist', 'migrations', '*.js')],
  synchronize: false,
  logging: true,
});
