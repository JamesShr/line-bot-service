import { Module, Global } from '@nestjs/common';
import { TYPES } from '@/types';
import { RedisServiceImpl } from '@/services/redis/redis.service';

const modules = [
  {
    provide: TYPES.RedisService,
    useClass: RedisServiceImpl,
  },
];

@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class ServiceModule { }
