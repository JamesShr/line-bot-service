import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexModule } from '@/modules/index.module';
import { AppController } from '@/app.controller';
import { ServiceModule } from '@/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServiceModule,
    IndexModule,
  ],
  controllers: [AppController],
})

export class AppModule { }
