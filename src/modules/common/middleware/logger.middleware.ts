import { NestMiddleware, Injectable, Logger } from '@nestjs/common';
@Injectable()
export class LoggerMiddlware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    Logger.log('I am middleware by class');
    next();
  }
}

export const logger = (req: any, res: any, next: () => void): void => {
  Logger.log('I am middleware by function');
  next();
};
