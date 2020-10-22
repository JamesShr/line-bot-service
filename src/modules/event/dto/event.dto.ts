import { MessageDto } from '@/modules/message/dto/message.dto';
import { ThingEventDto } from '@/modules/thing/dto/thing.dto';
import { PostbackDto } from '@/modules/postback/dto/postback.dto';

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
    postback: PostbackDto;
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
