import { promisify } from 'util';
import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { REDIS_PORT, REDIS_HOST, JOBQUEUE_REDIS_DB } from '@/env';
import { RedisConnectionError } from '@/errors/all.exception';

export interface AsyncRedisClient {
  lrangeAsync: (key: string, value1: number, value2: number) => Promise<string[]>;
  rpushAsync: (key: string, value: string) => Promise<string>;
  lpopAsync: (key: string) => Promise<string>;
  getAsync: (key: string) => Promise<string>;
  setAsync: (key: string, value: string) => Promise<string>;
  keysAsync: (key: string) => Promise<string[]>;
  delkeysAsync: (key: string) => Promise<string>;
}

export interface RedisService {
  getRedisClient(): AsyncRedisClient;
  getRedisConnect(): RedisClient;
}

@Injectable()
export class RedisServiceImpl implements RedisService {
  private client: RedisClient;

  private asyncRedisClient: AsyncRedisClient;

  public constructor() {
    this.client = createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
      db: JOBQUEUE_REDIS_DB,
    });
    this.asyncRedisClient = this.makeAsyncRedisClient();
    this.client.on('connect', () => {
      Logger.log(`Connect to redis ${REDIS_HOST}:${REDIS_PORT} successfully.`);
    });

    this.client.on('error', (err) => {
      throw new RedisConnectionError(err.stack);
    });
  }

  public getRedisConnect(): RedisClient {
    return this.client;
  }

  public getRedisClient(): AsyncRedisClient {
    return this.asyncRedisClient;
  }

  public makeAsyncRedisClient(): AsyncRedisClient {
    return {
      lrangeAsync: promisify(this.client.lrange).bind(this.client),
      rpushAsync: promisify(this.client.rpush).bind(this.client),
      lpopAsync: promisify(this.client.lpop).bind(this.client),
      getAsync: promisify(this.client.get).bind(this.client),
      setAsync: promisify(this.client.set).bind(this.client),
      keysAsync: promisify(this.client.keys).bind(this.client),
      delkeysAsync: promisify(this.client.del).bind(this.client),
    };
  }
}
