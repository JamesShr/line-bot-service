import config from 'config';

export const HTTP_PORT = config.get('port.http') as number;
export const WEB_HOST = config.get('client.host') as string;

export const REDIS_HOST = config.get('redis.host') as string;
export const REDIS_PORT = config.get('redis.port') as number;
export const REDIS_PASSWORD = config.get('redis.password') as string;
export const SESSION_REDIS_DB = config.get('redis.sessionDB') as number;
export const JOBQUEUE_REDIS_DB = config.get('redis.jobQueueDB') as number;

export const LINE_NOTIFY_TOKEN = config.get('notify.token') as string;

export const CHATBOT_ID = config.get('chatbot.channelId') as string;
export const CHATBOT_SECRET = config.get('chatbot.channelSecret') as string;
export const CHATBOT_TOKEN = config.get('chatbot.channelToken') as string;
