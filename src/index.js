const core = require('@sqorn/lib-core')
const adapter = require('@sqorn/adapter-pg')
const dialect = require('@sqorn/dialect-postgres')

module.exports = core({ adapter, dialect })
