import Redis from 'ioredis';
declare let redis: Redis | null;
export declare function redisGet(key: string): Promise<string | null>;
export declare function redisSet(key: string, value: string, mode?: string, duration?: number): Promise<void>;
export declare function redisDel(key: string): Promise<void>;
export { redis };
