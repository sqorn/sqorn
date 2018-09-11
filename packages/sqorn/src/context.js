/** Transforms method call linked list to context object */
const context = (method, inherit, existingCtx) => {
  // initialize context inheriting some properties from parent query
  const ctx = existingCtx || {
    type: 'select',
    exp: 'from',
    sql: [],
    frm: [],
    whr: [],
    ret: [],
    ins: [],
    set: [],
    arg: inherit.arg || [],
    parameter: inherit.parameter
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
    case 'with':
      ctx.with = method.args
      break
    case 'recursive':
      ctx.recursive = true
      break
    case 'from':
      ctx.frm.push(method.args)
      break
    case 'where':
      ctx.whr.push(method.args)
      break
    case 'return':
      ctx.ret.push(method.args)
      break
    // select
    case 'group':
      ctx.grp = method.args
      break
    case 'having':
      ctx.hav = method.args
      break
    case 'order':
      ctx.ord = method.args
      break
    case 'limit':
      ctx.lim = method.args
      break
    case 'offset':
      ctx.off = method.args
      break
    // insert
    case 'insert':
    case 'value':
      ctx.type = 'insert'
      ctx.ins.push(method.args)
      break
    // update
    case 'set':
      ctx.type = 'update'
      ctx.set.push(method.args)
      break
    // delete
    case 'delete':
      ctx.type = 'delete'
      break
    // extend
    case 'extend':
      for (const builder of method.args) {
        context(builder.method, undefined, ctx)
      }
      break
    // express syntax
    case 'exp':
      switch (ctx.exp) {
        case 'from':
          ctx.frm.push(method.args)
          ctx.exp = 'where'
          break
        case 'where':
          ctx.whr.push(method.args)
          ctx.exp = 'return'
          break
        case 'return':
          ctx.ret.push(method.args)
          ctx.exp = 'done'
          break
      }
      break
  }
}

module.exports = context
