import 'dotenv/config';
import type { StringValue } from 'ms';
export declare const env: {
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: StringValue;
    JWT_REFRESH_EXPIRES_IN: StringValue;
};
