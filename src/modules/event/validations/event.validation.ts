/* eslint-disable @typescript-eslint/camelcase */
import {
  object, string, number, array,
} from 'yup';

export const EventsValidation = object().shape({
  events: array().of(object().shape({
    type: string().required(),
    replyToken: string().required(),
    source: object().shape({
      userId: string().required(),
      type: string().required(),
    }),
    timestamp: number().required(),
    mode: string().required(),
  })),
  destination: string().required(),
});
