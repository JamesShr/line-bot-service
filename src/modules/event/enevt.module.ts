import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from '@/types';
import { EventController } from '@/modules/event/event.controller';
import { EventServiceImpl } from '@/modules/event/event.service';
import { MessageModule } from '@/modules/message/message.module';
import { PostbackModule } from '@/modules/postback/postback.module';
import { ThingModule } from '@/modules/thing/thing.module';

const modules = [
  {
    provide: TYPES.EventService,
    useClass: EventServiceImpl,
  },
];

@Module({
  imports: [
    MessageModule,
    ThingModule,
    PostbackModule,
  ],
  controllers: [EventController],
  providers: modules,
  exports: modules,
})

export class EventModule { }
