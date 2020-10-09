import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MorganModule } from 'nest-morgan';
import { IndexModule } from '@/modules/index.module';
import { AppController } from '@/app.controller';
import { ServiceModule } from './services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MorganModule.forRoot(),
    ServiceModule,
    IndexModule,
  ],
  controllers: [AppController],
})

export class AppModule {
  constructor() {
    Logger.log(TypeOrmModule.forRoot());
  }
}
