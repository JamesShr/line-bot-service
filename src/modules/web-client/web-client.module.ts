import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from '@/types';
import { WebClientController } from '@/modules/web-client/web-client.controller';
import { WebClientServiceImpl } from '@/modules/web-client/web-client.service';
import { ThingModule } from '@/modules/thing/thing.module';

const modules = [
  {
    provide: TYPES.WebClientService,
    useClass: WebClientServiceImpl,
  },
];

@Module({
  imports: [
    ThingModule,
  ],
  controllers: [WebClientController],
  providers: modules,
  exports: modules,
})

export class WebClientModule { }
