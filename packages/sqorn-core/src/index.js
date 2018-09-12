module.exports = ({ database, dialect }) => (config = {}) => {
  const { methods, context, queries, parameter } = dialect
  const client = config.connection && database(config)
  const builder = {
    // create new query builder
    create(method) {
      const fn = (...args) =>
        fn.create({ type: 'express', args, prev: fn.method })
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
      return queries[ctx.type](ctx)
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
    // transaction execution
    transaction(fn) {
      return fn ? client.transactionCallback(fn) : client.transactionObject()
    },
    // extends
    extend(...args) {
      return this.create({ type: 'extend', args, prev: this.method })
    }
  }
  // add query building methods
  for (const method in methods) {
    if (methods[method]) {
      // add function call methods
      builder[method] = function(...args) {
        return this.create({ type: method, args, prev: this.method })
      }
    } else {
      // add getter methods
      Object.defineProperty(builder, method, {
        get: function() {
          return this.create({ type: method, prev: this.method })
        }
      })
    }
  }

  return builder.create()
}
