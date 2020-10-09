import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { PathNotFoundError } from '@/errors/all.exception';

@Catch(HttpException)
export class NotfoundExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const next = ctx.getNext<NextFunction>();
    if (status === HttpStatus.NOT_FOUND) {
      next(
        new PathNotFoundError('Request path not found.'),
      );
    }
    next();
  }
}
