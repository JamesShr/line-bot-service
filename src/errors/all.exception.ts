/* eslint-disable max-classes-per-file */
export enum ErrorCode {
  MissingAccessTokenError = 'MISSING_ACCESS_TOKEN_ERROR',
  InvalidAccessTokenError = 'INVALID_ACCESS_TOKEN_ERROR',
  ValidationError = 'VALIDATION_ERROR',
  PathNotFoundError = 'PATH_NOT_FOUND_ERROR',
  UnauthorizedException='UNAUTHORIZED_EXCEPTION',

  ExportFileHandleError = 'EXPORT_FILE_HANDL_EERROR',
  ThingIdNotFoundError = 'THINGID_NOT_FOUND_ERROR',
  RedisConnectionError='REDIS_CONNECTION_ERROR',
  UnknownError = 'UNKNOWN_ERROR'
}

export class ApplicationException extends Error {
  public readonly code: ErrorCode;

  public constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class MissingAccessTokenError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.MissingAccessTokenError,
    );
  }
}
export class InvalidAccessTokenError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.InvalidAccessTokenError,
    );
  }
}
export class UnauthorizedException extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.UnauthorizedException,
    );
  }
}

export class ExportFileHandleError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.ExportFileHandleError,
    );
  }
}
export class ThingIdNotFoundError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.ThingIdNotFoundError,
    );
  }
}
export class RedisConnectionError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.RedisConnectionError,
    );
  }
}
export class UnknownError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.UnknownError,
    );
  }
}
export class ValidationError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.ValidationError,
    );
  }
}

export class PathNotFoundError extends ApplicationException {
  public constructor(message: string) {
    super(
      message,
      ErrorCode.PathNotFoundError,
    );
  }
}
