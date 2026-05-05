import Redis from 'ioredis';
import { env } from '../../config/env.js';
let redis = null;
try {
    redis = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3)
                return null;
            return Math.min(times * 200, 1000);
        },
    });
    redis.on('error', () => { });
}
catch {
    redis = null;
}
export async function redisGet(key) {
    if (!redis)
        return null;
    try {
        return await redis.get(key);
    }
    catch {
        return null;
    }
}
export async function redisSet(key, value, mode, duration) {
    if (!redis)
        return;
    try {
        if (mode === 'EX' && duration) {
            await redis.set(key, value, 'EX', duration);
        }
        else {
            await redis.set(key, value);
        }
    }
    catch { }
}
export async function redisDel(key) {
    if (!redis)
        return;
    try {
        await redis.del(key);
    }
    catch { }
}
export { redis };
