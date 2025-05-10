import dotenv from 'dotenv';
import { cleanEnv, str, port, bool } from 'envalid';

dotenv.config();

export const envConfig = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PGHOST: str(),
  DB_PORT: port({ default: 5432 }),
  PGUSER: str(),
  PGPASSWORD: str(),
  PGDATABASE: str(),
  SECRET_KEY_ONE: str(),
  SECRET_KEY_TWO: str(),
  JWT_ACCESS_SECRET: str()
});
