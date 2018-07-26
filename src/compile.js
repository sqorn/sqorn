/** Transforms array of method call objects to context object */
const context = methods => {
  let exp = 'frm'
  const ctx = {
    type: 'select',
    val: [],
    opt: { debug: false, separator: ' ', uppercase: false }
  }
  methods.forEach(method => {
    switch (method.type) {
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
        const { debug = false, separator = ' ', uppercase = false } =
          method.args || {}
        ctx.opt = { debug, separator, uppercase }
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

/** Transforms context object to SQL query string */
// prettier-ignore
const query = {
  select: ctx =>
    Query(
      With(ctx),
      Select(ctx),
      From(ctx),
      Where(ctx),
      Group(ctx),
      Having(ctx),
      Order(ctx),
      Limit(ctx),
      Offset(ctx)
    ),
  delete: ctx =>
    Query(
      With(ctx),
      Delete(ctx),
      From(ctx),
      Where(ctx),
      Returning(ctx)
    ),
  insert: ctx =>
    Query(
      With(ctx),
      Insert(ctx),
      Values(ctx),
      Returning(ctx)
    ),
  update: ctx =>
    Query(
      Update(ctx),
      Set_(ctx),
      Where(ctx),
      Returning(ctx)
    )
}

// shared
const With = ctx => undefined
const From = ctx => ctx.frm && `from ${build(ctx.frm)}`
const Where = ctx => ctx.whr && `where ${build(ctx.whr)}`
const Returning = ctx => ctx.ret && `returning ${build(ctx.ret)}`

// select
const Select = ctx => (ctx.ret ? `select ${build(ctx.ret)}` : `select *`)
const Group = ctx => ctx.grp && `group by ${ctx.grp}`
const Having = ctx => ctx.hav && `having ${ctx.hav}`
const Order = ctx => ctx.ord && `order by ${ctx.ord}`
const Limit = ctx => ctx.lim && `limit ${ctx.lim}`
const Offset = ctx => ctx.off && `offset ${ctx.off}`

// delete
const Delete = ctx => `delete`

// insert
const Insert = ctx => `insert into ${build(ctx.frm)} (${build(ctx.ins)})`
const Values = ctx => `values ${Tuples(ctx)}`
const Tuples = ctx => ctx.val.map(tuple => `(${build(tuple)})`).join(', ')

// update
const Update = ctx => `update ${build(ctx.frm)}`
const Set_ = ctx => `set ${build(ctx.upd)}`

const Query = (...clauses) =>
  clauses
    .filter(clause => clause !== undefined)
    .map(clause => clause.trim())
    .join(' ')

const build = params => {
  if (isTaggedTemplate(params)) {
    const [strings, ...args] = params
    return buildTaggedTemplate(strings, args)
  } else {
    throw Error('Cant build plain function calls yet')
  }
}

const isTaggedTemplate = args =>
  Array.isArray(args) &&
  Array.isArray(args[0]) &&
  typeof args[0][0] === 'string'

const buildTaggedTemplate = (strings, args) => {
  let result = strings[0]
  for (let i = 0; i < args.length; i++) {
    result += args[i] + strings[i + 1]
  }
  return result
}

/** Transforms array of method call objects to SQL query string */
const compile = methods => {
  const ctx = context(methods)
  return query[ctx.type](ctx)
}

module.exports = compile
