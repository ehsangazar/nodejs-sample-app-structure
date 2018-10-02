const Loki = require('lokijs');

let database;

if (process.env.NODE_ENV === 'test') {
  database = new Loki('test.db');
}
if (process.env.NODE_ENV === 'development') {
  database = new Loki(process.env.ExampleDB || 'development.db');
}
if (process.env.NODE_ENV === 'production') {
  database = new Loki(process.env.ExampleDB || 'production.db');
}

module.exports = database;
