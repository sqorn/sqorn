const transactionCreator = require('sqorn-transactions')

module.exports = ({ pg, pool }) => {
  if (!pool) return undefined
  if (!pg) throw Error('Sqorn missing argument "pg"')

  const query = async ({ text, args }, trx) => {
    const query = { text, values: args }
    const client = trx || pool
    const result = await client.query(query)
    return result.rows
  }

  const end = () => pool.end()

  const acquireTransactionClient = () => {}

  const releaseTransactionClient = () => {}

  const transaction = transactionCreator({
    query,
    acquireTransactionClient,
    releaseTransactionClient
  })

  return {
    query,
    end,
    transaction
  }
}
