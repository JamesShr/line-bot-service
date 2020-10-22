/* eslint-disable no-useless-return */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { TYPES } from '@/types';
import { LineApiService } from '@/services/line-api/line-api.service';
import { RedisService } from '@/services/redis/redis.service';
import { UnknownError } from '@/errors/all.exception';
import { MessageDto, ReplyMessageDto } from '@/modules/message/dto/message.dto';

export interface MessageService {
  handleMessage(
    userId: string,
    replyToken: string,
    message: MessageDto,
  ): Promise<any>;
}

@Injectable()
export class MessageServiceImpl implements MessageService {
  constructor(
    @Inject(TYPES.RedisService)
    private readonly redis: RedisService,
    @Inject(TYPES.LineApiService)
    private readonly line: LineApiService,
  ) { }

  public async handleMessage(
    userId: string,
    replyToken: string,
    message: MessageDto,
  ): Promise<any> {
    const returnMessage = [];
    switch (message.type) {
      default:
        returnMessage.push({
          type: 'text',
          text: '?',
          sender: {
            name: 'Cony',
            iconUrl: 'https://line.me/conyprof',
          },
        });
        break;
    }
    await this.replyMessage(replyToken, returnMessage);
  }

  public async replyMessage(replyToken: string, defaultMessage: ReplyMessageDto[]): Promise<any> {
    try {
      const replyMessage = {
        replyToken,
        messages: defaultMessage,
      };
      await this.line.reply(JSON.stringify(replyMessage));
      return;
    } catch (error) {
      throw new UnknownError(error);
    }
  }
}
