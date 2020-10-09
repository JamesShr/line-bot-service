import config from 'config';

export const HTTP_PORT = config.get('port.http') as number;
export const SOCKET_PORT = config.get('port.socket') as number;

export const REDIS_HOST = config.get('redis.host') as string;
export const REDIS_PORT = config.get('redis.port') as number;
export const REDIS_PASSWORD = config.get('redis.password') as string;
export const SESSION_REDIS_DB = config.get('redis.sessionDB') as number;
export const JOBQUEUE_REDIS_DB = config.get('redis.jobQueueDB') as number;

export const MQTT_HOST = config.get('mqtt.host') as string;
export const MQTT_PORT = config.get('mqtt.port') as number;
export const MQTT_SUB_TOPIC = config.get('mqtt.subscribe') as string;
export const MQTT_PUB_TOPIC = config.get('mqtt.publish') as string;

export const CHATBOT_ID = config.get('chatbot.channelId') as string;
export const CHATBOT_SECRET = config.get('chatbot.channelSecret') as string;
export const CHATBOT_TOKEN = config.get('chatbot.channelToken') as string;

export const TAOYUAN_HOST = config.get('taoyuan.host') as string;
