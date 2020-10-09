import { Module, Global } from '@nestjs/common';
import { TYPES } from '@/types';
import { RedisServiceImpl } from '@/services/redis/redis.service';
import { LineApiServiceImpl } from '@/services/line-api/line-api.service';

const modules = [
  {
    provide: TYPES.RedisService,
    useClass: RedisServiceImpl,
  },
  {
    provide: TYPES.LineApiService,
    useClass: LineApiServiceImpl,
  },
];

@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class ServiceModule { }
