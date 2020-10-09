import { Module } from '@nestjs/common';
import { TYPES } from '@/types';
import { MessageServiceImpl } from '@/modules/message/message.service';

const modules = [
  {
    provide: TYPES.MessageService,
    useClass: MessageServiceImpl,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: modules,
  exports: modules,
})

export class MessageModule {
}
