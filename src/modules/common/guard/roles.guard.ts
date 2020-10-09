import {
  Injectable, CanActivate, ExecutionContext, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UnauthorizedException } from '@/errors/all.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    Logger.log('AuthGuard');
    if (request.params.num === '1') {
      return true;
    }
    throw new UnauthorizedException('Forbidden resource');
  }
}
