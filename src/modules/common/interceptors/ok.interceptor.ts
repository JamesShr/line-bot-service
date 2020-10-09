import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
  'status': number;
  'code': string;
  'message': string;
  'data': T;
}
@Injectable()
export class OkInterceptor<T> implements NestInterceptor<T, Response<T>> {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    Logger.log('before intercept');
    return next
      .handle()
      .pipe(
        map(
          (data) => ({
            status: 200,
            code: 'OK',
            message: 'successful',
            data,
          }),
        ), tap(
          () => { Logger.log('after intercept'); },
        ),
      );
  }
}
