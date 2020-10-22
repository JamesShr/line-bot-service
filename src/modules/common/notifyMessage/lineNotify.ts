import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {
  LINE_NOTIFY_TOKEN,
} from '@/env';

function pushMessage(messages: any): any {
  try {
    Logger.log('pushMessage');
    const form = new FormData();
    form.append('message', messages);

    (async () => {
      await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        headers: {
          Authorization: LINE_NOTIFY_TOKEN,
        },
        body: form,
      });
    })();
  } catch (error) {
    Logger.log(error);
  }
}

export const lineService = {
  pushMessage,
};
