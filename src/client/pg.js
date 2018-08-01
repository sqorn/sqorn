module.exports = class {
  constructor(connection) {
    const pg = require('pg')
    this.pool = new pg.Pool(connection)
  }
  async query({ txt, arg }, trx) {
    const obj = { text: txt, values: arg }
    const result = await (trx ? trx.query(obj) : this.pool.query(obj))
    return result.rows
  }
  async transaction(fn) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await fn(client)
      await client.query('COMMIT')
      return result
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
  async end() {
    return this.pool.end()
  }
}
