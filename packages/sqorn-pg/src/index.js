const pg = require('pg')
const lodashCamelCase = require('lodash.camelcase')

const camelCaseCache = {}
const camelCase = str =>
  camelCaseCache[str] || (camelCaseCache[str] = lodashCamelCase(str))

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

module.exports = {
  database: connection => ({
    pool: new pg.Pool(connection),
    end() {
      return this.pool.end()
    },
    async query({ text, args }, trx) {
      const query = { text, values: args }
      const client = trx || this.pool
      const result = await client.query(query)
      return result.rows
    },
    async transactionCallback(fn) {
      const client = await this.pool.connect()
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
    },
    async transactionObject() {
      const client = await this.pool.connect()
      await client.query('begin')
      return {
        commit: async () => {
          try {
            await client.query('commit')
          } finally {
            client.release()
          }
        },
        rollback: async () => {
          try {
            await client.query('rollback')
          } finally {
            client.release()
          }
        }
      }
    }
  }),
  builder: {
    parameter: (ctx, arg) =>
      arg === undefined ? 'default' : `$${ctx.arg.push(arg)}`
    // context: {

    // },
    // grammar: {
    //   select: [],
    //   delete: [],
    //   insert: [],
    //   update: []
    // },
    // clauses: {

    // }
  }
}
