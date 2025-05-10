import dotenv from 'dotenv';
import { Knex, knex } from 'knex';
import path from 'path';

dotenv.config({ path: '../../.env' });

/**
 * Use this command to create migration file
 * - npx knex migrate:make <migration-name> --migrations-directory database/migrations
 */
const databaseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations')
  }
};

export const knexInstance = knex(databaseConfig);

// Export the config for Knex CLI
export default databaseConfig;
