import 'dotenv/config';
import type { StringValue } from 'ms';

export const env = {
  PORT: Number(process.env.API_PORT) || 3333,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '15m') as StringValue,
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
};
