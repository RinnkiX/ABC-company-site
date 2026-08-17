import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

const keyForUser = (userId: string) => `aurinko:account:${userId}`;

export interface StoredAurinkoAccount {
  accountId: number;
  email: string;
  serviceType: string;
  accessToken: string;
}

export async function saveAurinkoAccount(
  userId: string,
  account: StoredAurinkoAccount
): Promise<void> {
  // Upstash Redis serializes values as JSON automatically.
  await redis.set(keyForUser(userId), account);
}

export async function getAurinkoAccount(
  userId: string
): Promise<StoredAurinkoAccount | null> {
  return await redis.get<StoredAurinkoAccount>(keyForUser(userId));
}

export async function deleteAurinkoAccount(userId: string): Promise<void> {
  await redis.del(keyForUser(userId));
}
