import { envConfig } from '@/config/env.config';
import { Knex, knex } from 'knex';

/**
 * Use this command to create migration file
 * - npx knex migrate:make <migration-name> --migrations-directory database/migrations
 */
const databaseConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: envConfig.PGDATABASE,
    user: envConfig.PGUSER,
    password: envConfig.PGPASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

export const knexInstance = knex(databaseConfig);
