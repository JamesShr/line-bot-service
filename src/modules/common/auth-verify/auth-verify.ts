import { Logger } from '@nestjs/common';
import { MissingAccessTokenError } from '@/errors/all.exception';

function findUser(req: any, headers: any): any {
  const userData = {
    userId: '',
  };
  userData.userId = headers.userid || '';

  if (userData.userId === '') {
    throw new MissingAccessTokenError('USER_ID_FOUND');
  }
  return userData;
}

export const authVerify = {
  findUser,
};
