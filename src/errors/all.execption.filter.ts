import {
  ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger,
} from '@nestjs/common';


import { ApplicationException, ErrorCode } from './all.exception';

const { NODE_ENV } = process.env;
const DEFAULT_ERROR_MESSAGE = 'The server is temporarily unable to service your request.';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof ApplicationException
      ? this.mapToHttpException(exception.code)
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const code = exception instanceof ApplicationException
      ? exception.code
      : ErrorCode.UnknownError;

    const message = exception instanceof ApplicationException
      ? this.hideMessage(exception.message, status)
      : this.hideMessage((exception as Error).message, status);

    response.status(status).json({
      status,
      code,
      message,
    });
  }

  private mapToHttpException(code: ErrorCode): HttpStatus {
    switch (code) {
      case ErrorCode.ValidationError:
        return HttpStatus.BAD_REQUEST;

      case ErrorCode.MissingAccessTokenError:
      case ErrorCode.InvalidAccessTokenError:
      case ErrorCode.UnauthorizedException:
        return HttpStatus.UNAUTHORIZED;

      case ErrorCode.PathNotFoundError:
      case ErrorCode.ThingIdNotFoundError:
        return HttpStatus.NOT_FOUND;

      case ErrorCode.ExportFileHandleError:
      case ErrorCode.UnknownError:
      case ErrorCode.RedisConnectionError:
        return HttpStatus.INTERNAL_SERVER_ERROR;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private hideMessage(message: string, status: HttpStatus): string {
    if (status > 499) Logger.error(message);

    if (
      NODE_ENV === 'production'
      && status === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      return DEFAULT_ERROR_MESSAGE;
    }
    return message;
  }
}
