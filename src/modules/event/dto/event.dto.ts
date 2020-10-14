import { MessageDto } from '@/modules/message/dto/message.dto';
import { ThingEventDto } from '@/modules/thing/dto/thing.dto';

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
    things: ThingEventDto;
  }[];
  destination: string;
}

export interface UserProfileDto {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  language: string;
}
