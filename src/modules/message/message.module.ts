import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from '@/types';
import { MessageController } from '@/modules/message/message.controller';
import { MessageServiceImpl } from '@/modules/message/message.service';

const modules = [
  {
    provide: TYPES.MessageService,
    useClass: MessageServiceImpl,
  },
];

@Module({
  imports: [],
  controllers: [MessageController],
  providers: modules,
  exports: modules,
})

export class MessageModule {
}
