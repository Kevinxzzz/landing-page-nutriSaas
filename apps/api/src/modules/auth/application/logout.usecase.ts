import { redisDel, redisSet } from '../../../shared/providers/redis.js';

export async function logoutUseCase(userId: string, accessToken: string) {
  await redisDel(`refresh:${userId}`);
  await redisSet(`bl:${accessToken}`, '1', 'EX', 15 * 60);
}
