const context = require('./context')
const query = require('./query')

const createBuilder = ({
  client: {
    database,
    builder: { parameter }
  },
  connection
} = {}) => {
  const client = connection && database(connection)
  const builder = {
    create(method) {
      const fn = (...args) => fn.create({ type: 'exp', args, prev: fn.method })
      fn.method = method
      Object.setPrototypeOf(fn, builder)
      return fn
    },
    // close connection
    async end() {
      return client.end()
    },
    // compilation methods
    bld(inheritedCtx) {
      const ctx = context(this.method, inheritedCtx)
      return query[ctx.type](ctx)
    },
    get query() {
      return this.bld({ parameter })
    },
    // execution methods
    async one(trx) {
      const rows = await client.query(this.query, trx)
      return rows[0]
    },
    async all(trx) {
      return client.query(this.query, trx)
    },
    then(resolve) {
      resolve(this.all())
    },
    transaction(fn) {
      return fn ? client.transactionCallback(fn) : client.transactionObject()
    },
    // getter query building methods
    get delete() {
      return this.create({ type: 'delete', prev: this.method })
    },
    get recursive() {
      return this.create({ type: 'recursive', prev: this.method })
    }
  }
  // function query building methods
  ;[
    'l',
    'with',
    'from',
    'where',
    'return',
    'group',
    'having',
    'order',
    'limit',
    'offset',
    'insert',
    'value',
    'set',
    'extend'
  ].forEach(key => {
    builder[key] = function(...args) {
      return this.create({ type: key, args, prev: this.method })
    }
  })

  return builder.create()
}

module.exports = createBuilder
