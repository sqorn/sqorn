const {
  util: { camelCase }
} = require('sqorn-sql')

module.exports = ({ pg, pool }) => {
  if (!pool) return undefined
  if (!pg) throw Error('Sqorn missing argument "pg"')
  monkeyPatchCamelCase(pg)
  return {
    end: () => pool.end(),
    query: async ({ text, args }, trx) => {
      const query = { text, values: args }
      const client = trx || pool
      const result = await client.query(query)
      return result.rows
    },
    transactionCallback: async fn => {
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
    },
    transactionObject: async () => {
      const client = await pool.connect()
      await client.query('begin')
      return {
        query: client.query.bind(client),
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
  }
}

const monkeyPatchCamelCase = pg => {
  if (!pg.__monkeyPatchCamelCase) {
    pg.__monkeyPatchCamelCase = true
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
}
