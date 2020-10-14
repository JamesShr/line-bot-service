import { Module } from '@nestjs/common';
import { TYPES } from '@/types';
import { ThingServiceImpl } from '@/modules/thing/thing.service';

const modules = [
  {
    provide: TYPES.ThingService,
    useClass: ThingServiceImpl,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: modules,
  exports: modules,
})

export class ThingModule {
}
