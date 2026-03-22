import { createClient } from 'redis';
import { logger } from './pino.js';

const client = createClient({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});


export async function redisConnect() {
    client.on('error', err => logger.error('Redis Client Error', err));
    await client.connect();
}

export async function setRedisValue(key: string, value: string, ttl: number) {
    return await client.set(key, value);
}

export async function getRedisValue(key: string) {
    return await client.get(key);
}



// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

