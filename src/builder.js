const compile = require('./compile2')

const chain = Symbol()
const methods = Symbol()

function Builder(...args) {
  function fn(...args) {
    return Builder.prototype[chain]({ type: 'exp', args }, fn[methods])
  }
  Object.setPrototypeOf(fn, Builder.prototype)
  return fn
}

Builder.prototype = {
  // raw sql
  l(...args) {
    throw Error('Unimplemented')
  },
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
    return this[chain]({ type: 'del' })
  },
  // table
  tbl() {
    throw Error('Unimplemented')
  },
  // query execution methods
  get str() {
    return compile(this[methods]).txt
  },
  get bld() {
    return compile(this[methods])
  },
  async run(trx) {
    throw Error('Unimplemented')
  },
  async one(trx) {
    throw Error('Unimplemented')
  },
  async all(trx) {
    throw Error('Unimplemented')
  },
  async exs(trx) {
    throw Error('Unimplemented')
  },
  // transaction
  async trx(fn) {
    throw Error('Unimplemented')
  },
  // helper methods
  [chain](method, existing) {
    let self = this
    if (!this.hasOwnProperty(methods)) {
      self = new Builder()
      self[methods] = existing || []
    }
    self[methods].push(method)
    return self
  }
}
// standard chain methods
;[
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
    return this[chain]({ type: key, args })
  }
})

module.exports = Builder
