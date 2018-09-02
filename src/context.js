/** Transforms array of method call objects to context object */
const context = (method, parentCtx = {}) => {
  // initialize context inheriting some subquery properties from parent query
  const {
    arg = [],
    opt = {
      debug: false,
      separator: ' ',
      uppercase: false,
      client: 'pg'
    }
  } = parentCtx
  const ctx = {
    type: 'select',
    sql: [],
    whr: [],
    ins: [],
    upd: [],
    arg,
    opt
  }
  // follow method links to construct methods array (in reverse)
  const methods = []
  for (; method !== undefined; method = method.prev) {
    methods.push(method)
  }
  // build methods object by processing methods in call order
  let exp = 'frm'
  for (let i = methods.length - 1; i >= 0; --i) {
    const method = methods[i]
    switch (method.type) {
      // escape
      case 'l':
        ctx.type = 'sql'
        ctx.sql.push(method.args)
        break
      // shared
      case 'wth':
        throw Error('Unimplemented')
      case 'frm':
        ctx.frm = method.args
        break
      case 'whr':
        ctx.whr.push(method.args)
        break
      case 'ret':
        ctx.ret = method.args
        break
      // select
      case 'grp':
        ctx.grp = method.args
        break
      case 'hav':
        ctx.hav = method.args
        break
      case 'ord':
        ctx.ord = method.args
        break
      case 'lim':
        ctx.lim = method.args
        break
      case 'off':
        ctx.off = method.args
        break
      // insert
      case 'ins':
      case 'val':
        ctx.type = 'insert'
        ctx.ins.push(method.args)
        break
      // update
      case 'upd':
        ctx.type = 'update'
        ctx.upd.push(method.args)
        break
      // delete
      case 'del':
        ctx.type = 'delete'
        break
      // options
      case 'opt':
        Object.assign(ctx.opt, method.args)
        break
      case 'exp':
        switch (exp) {
          case 'frm':
            ctx.frm = method.args
            exp = 'whr'
            break
          case 'whr':
            ctx.whr.push(method.args)
            exp = 'ret'
            break
          case 'ret':
            ctx.ret = method.args
            exp = 'done'
            break
        }
        break
    }
  }
  return ctx
}

module.exports = context
