module.exports = {
  port: {
    http: {
      __name: 'HTTP_PORT',
      __format: 'json',
    },
  },
  client: {
    host: 'WEB_HOST',
  },
  postgres: {
    host: 'PG_HOST',
    port: {
      __name: 'PG_PORT',
      __format: 'json',
    },
    username: 'PG_USERNAME',
    password: 'PG_PASSWORD',
    database: 'PG_DATABASE',
  },
  redis: {
    host: 'REDIS_HOST',
    port: {
      __name: 'REDIS_PORT',
      __format: 'json',
    },
    sessionDB: {
      __name: 'SESSION_REDIS_DB',
      __format: 'json',
    },
    jobQueueDB: {
      __name: 'JOBQUEUE_REDIS_DB',
      __format: 'json',
    },
    password: 'REDIS_PASSWORD',
  },
  chatbot: {
    channelId: 'CHATBOT_ID',
    channelSecret: 'CHATBOT_SECRET',
    channelToken: 'CHATBOT_TOKEN',
  },
  taoyuan: {
    host: 'TAOYUAN_HOST',
  },
};
