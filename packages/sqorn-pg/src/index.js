const builder = require('sqorn-core')
const adapter = require('sqorn-adapter-pg')
const dialect = require('sqorn-dialect-postgres')

module.exports = builder({ adapter, dialect })
