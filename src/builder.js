const createClient = require('./client')
const context = require('./context')
const query = require('./query')

const createBuilder = config => {
  const builder = {
    create(method) {
      const fn = (...args) => fn.create({ type: 'exp', args, prev: fn.method })
      fn.method = method
      Object.setPrototypeOf(fn, builder)
      return fn
    },
    client: createClient(config),
    // close connection
    async end() {
      return this.client.end()
    },
    // compilation methods
    bld(inheritedCtx) {
      const ctx = context(this.method, inheritedCtx)
      return query[ctx.type](ctx)
    },
    get query() {
      return this.bld()
    },
    // execution methods
    async one(trx) {
      const rows = await this.client.query(this.bld(), trx)
      return rows[0]
    },
    async all(trx) {
      return this.client.query(this.bld(), trx)
    },
    then(resolve) {
      resolve(this.all())
    },
    // miscellaneous methods
    async transaction(fn) {
      return this.client.transaction(fn)
    },
    // logical operators
    not(arg) {
      throw Error('Unimplemented')
    },
    and(a, b) {
      throw Error('Unimplemented')
    },
    or(a, b) {
      throw Error('Unimplemented')
    },
    // special query building methods
    get delete() {
      return this.create({ type: 'delete', prev: this.method })
    }
  }
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
