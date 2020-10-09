/* eslint-disable no-useless-return */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { TYPES } from '@/types';
import { RedisService } from '@/services/redis/redis.service';

export interface EventService {
  test(): Promise<any>;
}

@Injectable()
export class EventServiceImpl implements EventService {
  constructor(
    @Inject(TYPES.RedisService)
    private readonly redis: RedisService,
  ) { }

  public async test(): Promise<any> {
    return 'success';
  }
}
