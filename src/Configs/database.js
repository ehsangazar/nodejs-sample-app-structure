const loki = require('lokijs')
let database = undefined

if (process.env.NODE_ENV === 'test'){
  database = new loki('test.db')
}
if (process.env.NODE_ENV === 'development'){
  database = new loki(process.env.ExampleDB || 'development.db')
}
if (process.env.NODE_ENV === 'production'){
  database = new loki(process.env.ExampleDB || 'production.db')
}

module.exports = database