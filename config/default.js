module.exports = {
  port: {
    http: 8107,
    socket: 8181,
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
  mqtt: {
    host: 'localhost',
    port: 1883,
    subscribe: 'RecToMQTTServerTopic',
    publish: 'SendToMQTTServerTopic',
  },
  chatbot: {
    channelId: '1653885989',
    channelSecret: 'fc2ac18c0223b76db7af2cbef4cf7cd2',
    channelToken: 'ihwBkYFDW6fNDaHRslgevdYwurjn2BCWhnYFAWhimxKc9YrL42seD3Ljkr4Do2bla72sLe780Oe4DONbLqIO1u1hEYfxBb5WLTVFeD0L8yO7mmARmTQpUr28VZKWgAFJSTIXNHGBEQTjypXXw2ubYAdB04t89/1O/w1cDnyilFU=',
  },
  taoyuan: {
    host: 'http://59.120.53.132:8018',
  },
};
