import { Module } from '@nestjs/common';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';

import { HealthService } from './services/health.service';
import { UsersService } from './services/users.service';
import { PostsService } from './services/posts.service';
import { FeedSseService } from './services/feed-sse.service';
import { SqliteConfigService } from './services/sqlite-config.service';
import { HealthController } from './controllers/health.controller';
import { UsersController } from './controllers/user.controller';
import { PostsController } from './controllers/post.controller';
import { FeedController } from './controllers/feed-sse.controller';

const isProduction = process.env.NODE_ENV === 'production';
const databasePath = isProduction
  ? join(__dirname, 'data', 'microblog.db')
  : join(process.cwd(), 'data', 'microblog.db');

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    TerminusModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databasePath,
      entities: [User, Post],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Post]),
  ],
  controllers: [FeedController, HealthController, UsersController, PostsController],
  providers: [FeedSseService, HealthService, UsersService, PostsService, SqliteConfigService],
})
export class APIModule {}
