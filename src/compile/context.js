/** Transforms array of method call objects to context object */
const context = (methods, inherited = {}) => {
  // extract ctx inherited by subquery from parent query
  const {
    parameters = 0,
    opt = {
      debug: false,
      separator: ' ',
      uppercase: false,
      client: 'pg'
    }
  } = inherited
  // initialize ctx
  const ctx = {
    type: 'select',
    parameters,
    val: [],
    opt
  }
  // process methods to create ctx
  let exp = 'frm'
  methods.forEach(method => {
    switch (method.type) {
      // escape
      case 'l':
        ctx.type = 'sql'
        ctx.l = method.args
        break
      case 'raw':
        ctx.type = 'raw'
        ctx.raw = method.args
        break
      // shared
      case 'wth':
        throw Error('Unimplemented')
      case 'frm':
        ctx.frm = method.args
        break
      case 'whr':
        ctx.whr = method.args
        break
      case 'ret':
        ctx.ret = method.args
        break
      // select
      case 'grp':
        ctx.grp = method.args
      case 'hav':
        ctx.hav = method.args
      case 'ord':
        ctx.ord = method.args
      case 'lim':
        ctx.lim = method.args
      case 'off':
        ctx.off = method.args
      // insert
      case 'ins':
        ctx.type = 'insert'
        ctx.ins = method.args
        break
      case 'val':
        ctx.val.push(method.args)
        break
      // update
      case 'upd':
        ctx.type = 'update'
        ctx.upd = method.args
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
            ctx.whr = method.args
            exp = 'ret'
            break
          case 'ret':
            ctx.ret = method.args
            exp = 'done'
            break
        }
        break
    }
  })
  return ctx
}

module.exports = context
