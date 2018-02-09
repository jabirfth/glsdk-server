const { Logger } = require('./utils/logger');

const logger = new Logger('Application Configuration');

const environment = process.env.NODE_ENV;

const config = {
  federalDB: {
    connector: environment === 'testing' ? 'memory' : 'mysql',
    host: process.env.FEDERAL_DB_HOST || 'localhost',
    port: process.env.FEDERAL_DB_PORT ? parseInt(process.env.FEDERAL_DB_PORT, 10) : 3306,
    database: process.env.FEDERAL_DB_NAME || 'grandlyon',
    user: process.env.FEDERAL_DB_USER || 'db_user',
    password: process.env.FEDERAL_DB_PASSWORD || 'P@ssw0rd',
  },
  fileStorage: {
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: process.env.FILE_STORAGE_PATH || '/tmp/storage',
  },
  authDB: {
    connector: environment === 'testing' ? 'memory' : 'mysql',
    host: process.env.AUTH_DB_HOST || 'localhost',
    port: process.env.AUTH_DB_PORT ? parseInt(process.env.AUTH_DB_PORT, 10) : 3306,
    database: process.env.AUTH_DB_NAME || 'grandlyon',
    user: process.env.AUTH_DB_USER || 'db_user',
    password: process.env.AUTH_DB_PASSWORD || 'P@ssw0rd',
  },
};

logger.info(
  JSON.stringify(
    Object.assign(
      {},
      config,
      {
        federalDB: Object.assign({}, config.federalDB, { password: '********' }),
        authDB: Object.assign({}, config.authDB, { password: '********' }),
      },
    ),
  ),
);

module.exports = config;
