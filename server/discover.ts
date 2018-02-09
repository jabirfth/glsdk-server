const app = require('./server');
const dataSource = app.dataSources.federalDB;

dataSource.discoverSchema('fed_agent', {}, (err: any, schema: any) => {
  console.log(JSON.stringify(schema, null, '  '));
});
