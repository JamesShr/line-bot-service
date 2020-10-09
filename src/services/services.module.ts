import { Module, Global } from '@nestjs/common';
import { RedisServiceImpl } from './redis/redis.service';
import { TYPES } from '@/types';
import { MQTTServiceImpl } from './mqtt/mqtt.service';

const modules = [
  {
    provide: TYPES.RedisService,
    useClass: RedisServiceImpl,
  },
  {
    provide: TYPES.MQTTService,
    useClass: MQTTServiceImpl,
  },
];

@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class ServiceModule { }
