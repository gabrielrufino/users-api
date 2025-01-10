import path from 'node:path';

import { defineConfig, MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from '@mikro-orm/sqlite';

import { configuration } from '../configuration';
import { User } from '../entities/user';
import { logger } from '../logger';

const { database } = configuration;

const config = defineConfig({
  clientUrl: database.driver !== 'sqlite'
    ? database.uri
    : undefined,
  dbName: database.driver === 'sqlite'
    ? path.join(database.uri, `${database.name}.sqlite`)
    : database.name,
  entities: [User],
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
});

const orm = await MikroORM.init(config);
logger.info('Connected to the database');

const generator = orm.getSchemaGenerator();
await generator.updateSchema();

export { config, orm };
