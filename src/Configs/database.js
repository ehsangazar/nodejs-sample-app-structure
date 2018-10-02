const loki = require('lokijs')
const database = new loki(process.env.DB_NAME || 'example.db')

module.exports = database