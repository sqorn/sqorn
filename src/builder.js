const createClient = require('./client')
const context = require('./context')
const query = require('./query')
const { isBuilder } = require('./constants')

const createBuilder = config => {
  function Builder() {
    function fn(...args) {
      return Builder.prototype.chain.call(fn, { type: 'exp', args })
    }
    Object.setPrototypeOf(fn, Builder.prototype)
    return fn
  }

  Builder.prototype = {
    // database library client
    [isBuilder]: true,
    config,
    client: createClient(config),
    // operators
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
      return this.chain({ type: 'del' })
    },
    // table
    tbl() {
      throw Error('Unimplemented')
    },
    // query execution methods
    bld(inheritedCtx) {
      const ctx = context(this.methods, inheritedCtx)
      return query[ctx.type](ctx)
    },
    get qry() {
      return this.bld()
    },
    async run(trx) {
      await this.client.query(this.bld(), trx)
    },
    async one(trx) {
      const rows = this.client.query(this.bld(), trx)
      return rows[0]
    },
    // TODO: add then methods equivalent to .all() with no args
    async all(trx) {
      return this.client.query(this.bld(), trx)
    },
    async exs(trx) {
      return this.client.query(this.bld(), trx).length > 0
    },
    // transaction
    async trx(fn) {
      return this.client.transaction(fn)
    },
    // close connection manually
    async end() {
      return this.client.end()
    },
    // internal debugging methods
    get mtd() {
      return this.methods
    },
    get ctx() {
      return context(this.methods)
    },
    get dbg() {
      return {
        mtd: this.mtd,
        ctx: this.ctx,
        qry: this.qry
      }
    },
    // chain method
    chain(method) {
      const next = new Builder()
      next.methods = [...(this.methods || []), method]
      return next
    }
  }
  // standard chain methods
  ;[
    // escape
    'l',
    // raw
    'raw',
    // shared
    'wth',
    'frm',
    'whr',
    'ret',
    // select
    'grp',
    'hav',
    'ord',
    'lim',
    'off',
    // insert
    'ins',
    'val',
    // update
    'upd',
    // options
    'opt'
  ].forEach(key => {
    Builder.prototype[key] = function(...args) {
      return this.chain({ type: key, args })
    }
  })

  return new Builder()
}

module.exports = createBuilder
