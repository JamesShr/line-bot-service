import {
  Controller, Post, Inject, UseInterceptors, Request, Logger, UsePipes, Body,
} from '@nestjs/common';
import { TYPES } from '@/types';
import { MessageService } from './message.service';
import { OkInterceptor } from '../common/interceptors/ok.interceptor';
import { YupValidationPipe } from '../common/pipes/yupValidation.pipe';
import { LineRequestValidation } from './validations/message.validation';
import { ParseDtoPipe } from '../common/pipes/parseDto.pipe';
import { LineRequestDto } from './dto/message.dto';
@Controller('/message')
@UseInterceptors(OkInterceptor)
export class MessageController {
  constructor(
    @Inject(TYPES.MessageService)
    private readonly messageService: MessageService,
  ) { }

  @Post()
  @UsePipes(new YupValidationPipe(LineRequestValidation))
  @UsePipes(ParseDtoPipe)
  public async router(
    @Request() req, @Body() body: LineRequestDto,
  ): Promise<any> {
    // Logger.log(req.headers);
    Logger.log(body.events[0].replyToken);
    const {
      type,
      replyToken,
      message,
      postback,
    } = body.events[0];
    const { userId } = body.events[0].source;
    Logger.log(type);
    switch (type) {
      case 'message':
        await this.messageService.handleMessage(userId, replyToken, message);
        break;
      case 'postback':
        await this.messageService.handlePostback(userId, replyToken, postback);
        break;
      default:
        break;
    }
  }
}
