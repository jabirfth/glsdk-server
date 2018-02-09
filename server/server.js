require('ts-node/register');
const loopback = require('loopback');
const boot = require('loopback-boot');
const bodyParser = require('body-parser');
const { Logger, loggerMiddleware } = require('./utils/logger');

const logger = new Logger('server.js');

const app = loopback();

app.use(loggerMiddleware());

app.middleware('parse', bodyParser.json());
app.middleware('parse', bodyParser.urlencoded({ extended: true }));

app.start = function () {
  const server = app.listen(() => {
    app.emit('started', server);
    const baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

boot(app, __dirname, (err) => {
  if (err) throw err;
  if (require.main === module) {
    app.start();
  }
});

module.exports = app;
