import { MessageDto } from '@/modules/message/dto/message.dto';

export interface EventsDto {
  events: {
    type: string;
    replyToken: string;
    source: {
      groupId?: string;
      userId: string;
      type: string;
    };
    timestamp: number;
    mode: string;
    message: MessageDto;
  }[];
  destination: string;
}
