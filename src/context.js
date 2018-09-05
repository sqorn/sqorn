/** Transforms method call linked list to context object */
const context = (method, inherit = { arg: [] }, existingCtx) => {
  // initialize context inheriting some properties from parent query
  const ctx = existingCtx || {
    type: 'select',
    exp: 'frm',
    sql: [],
    whr: [],
    ins: [],
    set: [],
    arg: inherit.arg
  }
  // follow method links to construct methods array (in reverse)
  const methods = []
  for (; method !== undefined; method = method.prev) {
    methods.push(method)
  }
  // build methods object by processing methods in call order
  for (let i = methods.length - 1; i >= 0; --i) {
    apply(ctx, methods[i])
  }
  return ctx
}

const apply = (ctx, method) => {
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
    case 'set':
      ctx.type = 'update'
      ctx.set.push(method.args)
      break
    // delete
    case 'del':
      ctx.type = 'delete'
      break
    // extend
    case 'ext':
      for (const builder of method.args) {
        context(builder.method, undefined, ctx)
      }
      break
    // express syntax
    case 'exp':
      switch (ctx.exp) {
        case 'frm':
          ctx.frm = method.args
          ctx.exp = 'whr'
          break
        case 'whr':
          ctx.whr.push(method.args)
          ctx.exp = 'ret'
          break
        case 'ret':
          ctx.ret = method.args
          ctx.exp = 'done'
          break
      }
      break
  }
}

module.exports = context
