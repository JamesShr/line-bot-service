import { MessageDto } from '@/modules/message/dto/message.dto';

export interface EventsDto {
  events: {
    type: string;
    replyToken: string;
    source: {
      userId: string;
      type: string;
    };
    timestamp: number;
    mode: string;
    message: MessageDto;
  }[];
  destination: string;
}
