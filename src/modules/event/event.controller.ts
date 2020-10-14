import {
  Controller, Post, Inject, UseInterceptors, Request, Logger, UsePipes, Body,
} from '@nestjs/common';
import { TYPES } from '@/types';
import { OkInterceptor } from '@/modules/common/interceptors/ok.interceptor';
import { YupValidationPipe } from '@/modules/common/pipes/yupValidation.pipe';
import { ParseDtoPipe } from '@/modules/common/pipes/parseDto.pipe';
import { EventsDto } from '@/modules/event/dto/event.dto';
import { EventsValidation } from '@/modules/event/validations/event.validation';
import { EventService } from '@/modules/event/event.service';
import { MessageService } from '@/modules/message/message.service';
import { ThingService } from '@/modules/thing/thing.service';

@Controller('/event')
@UseInterceptors(OkInterceptor)
export class EventController {
  constructor(
    @Inject(TYPES.EventService)
    private readonly eventService: EventService,
    @Inject(TYPES.MessageService)
    private readonly messageService: MessageService,
    @Inject(TYPES.ThingService)
    private readonly thingService: ThingService,
  ) { }

  @Post()
  public async router(
    @Request() req, @Body(new YupValidationPipe(EventsValidation)) body: EventsDto,
  ): Promise<void> {
    // Logger.log(req.headers);
    const {
      type,
      replyToken,
      message,
      things,
    } = body.events[0];
    const { userId, groupId } = body.events[0].source;
    Logger.log(body);
    switch (type) {
      case 'message':
        await this.messageService.handleMessage(userId, replyToken, message);
        break;
      case 'things':
        await this.thingService.handleEvent(userId, replyToken, things);
        break;
      default:
        break;
    }
  }
}
