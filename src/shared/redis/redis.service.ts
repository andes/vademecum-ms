import Redis from 'ioredis';

import { env } from '../../config/config';

let client: Redis | null = null;

const resolveConfig = () => {
    return {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        db: env.REDIS_DB,
    };
};

export const getRedisClient = (): Redis => {
    if (!client) {
        throw new Error('Redis not initialized. Call initializeRedis() first.');
    }
    return client;
};

export const initializeRedis = async (): Promise<void> => {
    if (client) {
        return;
    }

    const config = resolveConfig();

    client = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        retryStrategy: (times: number) => {
            return Math.min(times * 100, 3000);
        },
        lazyConnect: true,
        maxRetriesPerRequest: 3,
    });

    client.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error('[Redis] Connection error:', err);
    });

    client.on('connect', () => {
        // eslint-disable-next-line no-console
        console.log('[Redis] Connected');
    });

    client.on('close', () => {
        // eslint-disable-next-line no-console
        console.warn('[Redis] Connection closed');
    });

    client.on('reconnecting', (delay: number) => {
        // eslint-disable-next-line no-console
        console.log(`[Redis] Reconnecting in ${delay}ms`);
    });

    try {
        await client.connect();
        await client.ping();
        // eslint-disable-next-line no-console
        console.log(`[Redis] Connection OK — ${config.host}:${config.port}`);
    } catch (error) {
        client = null;
        // eslint-disable-next-line no-console
        console.error('[Redis] Failed to connect:', error);
        throw error;
    }
};

export const closeRedis = async (): Promise<void> => {
    if (client) {
        await client.quit();
        client = null;
        // eslint-disable-next-line no-console
        console.log('[Redis] Connection closed');
    }
};
