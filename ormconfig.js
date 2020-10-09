/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('config');

module.exports = {
  type: 'postgres',
  name: 'default',
  host: config.get('postgres.host'),
  port: config.get('postgres.port'),
  username: config.get('postgres.username'),
  password: config.get('postgres.password'),
  database: config.get('postgres.database'),
  schema: config.get('postgres.schema'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migration/**/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'migration',
  },
  retryDelay: 6000,
  autoLoadModels: true,
  keepConnectionAlive: true,
  synchronize: true,
  logger: 'file',
};
