import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from '@/types';
import { MessageController } from './message.controller';
import { RepairRecord } from '@/entity/repairRecord.entity';
import { MessageServiceImpl } from './message.service';
import { RepairRecordRepositoryImpl } from './message.repository';

const modules = [
  {
    provide: TYPES.MessageService,
    useClass: MessageServiceImpl,
  },
  {
    provide: TYPES.MessageRepository,
    useClass: RepairRecordRepositoryImpl,
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([RepairRecord])],
  controllers: [MessageController],
  providers: modules,
  exports: modules,
})

export class MessageModule {
}
