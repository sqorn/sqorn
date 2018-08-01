const compile = require('./compile')
const createClient = require('./client')
const context = require('./compile/context')
const query = require('./compile/query')
const { isBuilder } = require('./constants')

const createBuilder = config => {
  function Builder() {
    function fn(...args) {
      return Builder.prototype.chain({ type: 'exp', args }, fn.methods)
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
    get str() {
      // TODO: escape queries using active client syntax
      return compile(this.methods, config).txt
    },
    qry(inheritedCtx) {
      const ctx = context(this.methods, inheritedCtx)
      return query[ctx.type](ctx)
    },
    async run(trx) {
      await this.client.query(this.qry(), trx)
    },
    async one(trx) {
      const rows = this.client.query(this.qry(), trx)
      return rows[0]
    },
    async all(trx) {
      return this.client.query(this.qry(), trx)
    },
    async exs(trx) {
      return this.client.query(this.qry(), trx).length > 0
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
        qry: this.qry()
      }
    },
    // chain method
    chain(method, existing) {
      let self = this
      if (!this.hasOwnProperty('methods')) {
        self = new Builder()
        self.methods = existing || []
      }
      self.methods.push(method)
      return self
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
