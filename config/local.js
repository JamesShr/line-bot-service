module.exports = {
  port: {
    http: 8108,
  },
  postgres: {
    host: 'database',
    port: 5432,
    username: 'dev',
    password: 'dev',
    database: 'db',
    schema: 'public',
  },
  session: {
    host: 'redis',
    port: 6379,
    password: '',
    db: 0,
  },
  redis: {
    host: 'redis',
    port: 6379,
    password: '',
    sessionDB: 0,
    jobQueueDB: 1,
  },
  chatbot: {
    channelId: '1654622423',
    channelSecret: 'f7cca61e3d6761252cddf676068023f7',
    channelToken: 'ONDxesA06cGBJcCf8kygUHLGFsWy4pFgn/NXmsz3F/KIFwezNHV7iFl1P9aNqStQ4lOFM24FMbQCzm8MmCBaO8lWwz1p+I8cVITR5An/X2G5kDfXn5Eq8e/9HSSYuocWSpKdcc15DRkAbq1WJPosmAdB04t89/1O/w1cDnyilFU=',
  },
};
