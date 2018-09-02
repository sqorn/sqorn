const createClient = require('./client')
const context = require('./context')
const query = require('./query')
const { isBuilder } = require('./constants')

const createBuilder = config => {
  const builder = {
    create(method) {
      const fn = (...args) => fn.create({ type: 'exp', args, prev: fn.method })
      fn.method = method
      Object.setPrototypeOf(fn, builder)
      return fn
    },
    [isBuilder]: true,
    client: createClient(config),
    // compilation methods
    bld(inheritedCtx) {
      const ctx = context(this.method, inheritedCtx)
      return query[ctx.type](ctx)
    },
    get qry() {
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
    async trx(fn) {
      return this.client.transaction(fn)
    },
    async end() {
      return this.client.end()
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
    // getter chain methods
    get del() {
      return this.create({ type: 'del', prev: this.method })
    }
  }
  ;[
    'l',
    'raw',
    'wth',
    'frm',
    'whr',
    'ret',
    'grp',
    'hav',
    'ord',
    'lim',
    'off',
    'ins',
    'val',
    'set',
    'opt'
  ].forEach(key => {
    builder[key] = function(...args) {
      return this.create({ type: key, args, prev: this.method })
    }
  })

  return builder.create()
}

module.exports = createBuilder
