import { redisDel, redisSet } from '../../../shared/providers/redis.js';
export async function logoutUseCase(userId, accessToken) {
    await redisDel(`refresh:${userId}`);
    await redisSet(`bl:${accessToken}`, '1', 'EX', 15 * 60);
}
