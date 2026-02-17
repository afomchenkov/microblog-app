import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SqliteConfigService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.dataSource.query('PRAGMA journal_mode = DELETE;');
    await this.dataSource.query('PRAGMA synchronous = FULL;');
  }
}
