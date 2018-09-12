const builder = require('sqorn-core')
const database = require('./database')
const dialect = require('./dialect')

module.exports = builder({ database, dialect })
