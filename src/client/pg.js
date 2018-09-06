const lodashCamelCase = require('lodash.camelcase')

const camelCaseCache = {}
const camelCase = str =>
  camelCaseCache[str] || (camelCaseCache[str] = lodashCamelCase(str))

const patchCamelCase = pg => {
  try {
    const { prototype } = pg.Query
    const { handleRowDescription } = prototype
    prototype.handleRowDescription = function(msg) {
      for (const field of msg.fields) {
        field.name = camelCase(field.name)
      }
      return handleRowDescription.call(this, msg)
    }
  } catch (error) {
    throw Error('Failed to monkey patch pg camelCase results')
  }
}

module.exports = class {
  constructor(connection) {
    const pg = require('pg')
    patchCamelCase(pg)
    this.pool = new pg.Pool(connection)
  }
  async query({ text, args }, trx) {
    const obj = { text, values: args }
    const result = await (trx ? trx.query(obj) : this.pool.query(obj))
    return result.rows
  }
  async transaction(fn) {
    const client = await pool.connect()
    try {
      await client.query('begin')
      const result = await fn(client)
      await client.query('commit')
      return result
    } catch (e) {
      await client.query('rollback')
      throw e
    } finally {
      client.release()
    }
  }
  async end() {
    return this.pool.end()
  }
}
