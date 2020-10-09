import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

import {
  CHATBOT_TOKEN,
} from '@/env';

export interface LineApiService {
  reply(token: string): Promise<void>;
}

@Injectable()
export class LineApiServiceImpl implements LineApiService {
  // public constructor() { }

  public async reply(replyMessage: string): Promise<void> {
    const result = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CHATBOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: replyMessage,
    });
    const resutnData = await result.json();
  }
}
