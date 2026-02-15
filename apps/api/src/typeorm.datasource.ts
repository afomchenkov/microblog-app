import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: join(process.cwd(), 'data', 'microblog.db'),
  entities: [User, Post],
  migrations: [join(process.cwd(), 'dist', 'migrations', '*.js')],
  synchronize: false,
  logging: true,
});
