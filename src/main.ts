import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { AllExceptionFilter } from '@/errors/all.execption.filter';
import { NotfoundExceptionFilter } from '@/errors/notfound.execption.filter';
import { HTTP_PORT } from '@/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.useGlobalFilters(
    new AllExceptionFilter(),
    new NotfoundExceptionFilter(),
  );
  await app.listen(HTTP_PORT, (): void => {
    Logger.log(`Server listening on port: ${HTTP_PORT || 52788}`);
  });
}
bootstrap();
