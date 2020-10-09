import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './errors/all.execption.filter';
import { NotfoundExceptionFilter } from './errors/notfound.execption.filter';
import {
  HTTP_PORT, REDIS_HOST, REDIS_PORT, SESSION_REDIS_DB,
} from './env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.useGlobalFilters(
    new AllExceptionFilter(),
    new NotfoundExceptionFilter(),
  );
  // app.use(cookieParser('Hello World!'));
  // const RedisStore = connectRedis(session);
  // app.use(session({
  //   name: 'orio.sid',
  //   secret: 'Hello World!',
  //   store: new RedisStore({
  //     client: createClient({
  //       host: REDIS_HOST,
  //       port: REDIS_PORT,
  //       db: SESSION_REDIS_DB,
  //     }),
  //   }),
  //   cookie: { httpOnly: true, maxAge: 100 * 1000 },
  //   resave: false,
  //   saveUninitialized: true,
  // }));

  await app.listen(HTTP_PORT, (): void => {
    Logger.log(`Server listening on port: ${HTTP_PORT || 52788}`);
  });
}
bootstrap();
