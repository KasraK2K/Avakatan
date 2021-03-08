import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const logger = new Logger('TypeORMConfig');

const dbConfig = config.get('db');

export let typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOSTNAME || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../**/*.migration.{js,ts}'],
  cache: true,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
