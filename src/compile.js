/** Transforms array of method call objects to context object */
const context = methods => {
  let exp = 'frm'
  const ctx = {
    type: 'select',
    parameters: 0,
    val: [],
    opt: { debug: false, separator: ' ', uppercase: false, client: 'pg' }
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
        const {
          debug = false,
          separator = ' ',
          uppercase = false,
          client = 'pg'
        } =
          method.args || {}
        ctx.opt = { debug, separator, uppercase, client }
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
    Query(ctx)(
      With,
      Select,
      From,
      Where,
      Group,
      Having,
      Order,
      Limit,
      Offset
    ),
  delete: ctx =>
    Query(ctx)(
      With,
      Delete,
      From,
      Where,
      Returning
    ),
  insert: ctx =>
    Query(ctx)(
      With,
      Insert,
      Values,
      Returning
    ),
  update: ctx =>
    Query(ctx)(
      Update,
      Set_,
      Where,
      Returning
    )
}

const Query = ctx => (...clauses) => {
  let txt = []
  const arg = []
  clauses.forEach(clause => {
    const compiled = clause(ctx)
    if (compiled) {
      txt.push(compiled.txt)
      arg.push(...compiled.arg)
    }
  })
  return { txt: txt.join(' '), arg }
}

const OptionalClause = (prefix, key) => ctx => {
  if (!ctx[key]) return
  const { txt, arg } = build(ctx, ctx[key])
  return {
    txt: `${prefix} ${txt}`,
    arg
  }
}

const RequiredClause = (prefix, key) => ctx => {
  const { txt, arg } = build(ctx, ctx[key])
  return {
    txt: `${prefix} ${txt}`,
    arg
  }
}

// shared
const With = ctx => undefined
const From = OptionalClause('from', 'frm')
const Where = OptionalClause('where', 'whr')
const Returning = OptionalClause('returning', 'ret')

// select
const Select = ctx => {
  if (ctx.ret) {
    const { txt, arg } = build(ctx, ctx.ret)
    return {
      txt: `select ${txt}`,
      arg
    }
  }
  return {
    txt: `select *`,
    arg: []
  }
}
const Group = OptionalClause('group by', 'grp')
const Having = OptionalClause('having', 'hav')
const Order = OptionalClause('order by', 'ord')
const Limit = OptionalClause('limit', 'lim')
const Offset = OptionalClause('offset', 'off')

// delete
const Delete = ctx => ({ txt: 'delete', arg: [] })

// insert
const Insert = ctx => {
  const frm = build(ctx, ctx.frm)
  const ins = build(ctx, ctx.ins)
  return {
    txt: `insert into ${frm.txt} (${ins.txt})`,
    arg: [...frm.arg, ...ins.arg]
  }
}
const Values = ctx => {
  const txt = []
  const arg = []
  ctx.val.forEach(val => {
    const tuple = build(ctx, val)
    txt.push(`(${tuple.txt})`)
    arg.push(tuple.arg)
  })
  return {
    txt: `values ${txt.join(', ')}`,
    arg
  }
}
// const Tuples = ctx => ctx.val.map(tuple => `(${build(tuple)})`).join(', ')

// update
const Update = RequiredClause('update', 'frm')
const Set_ = RequiredClause('set', 'upd')

const build = (ctx, params) => {
  if (isTaggedTemplate(params)) {
    return buildTaggedTemplate(ctx, params)
  } else {
    throw Error('Cant build plain function calls yet')
  }
}

const isTaggedTemplate = args =>
  Array.isArray(args) &&
  Array.isArray(args[0]) &&
  typeof args[0][0] === 'string'

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = strings[0]
  const arg = []
  for (let i = 0; i < args.length; i++) {
    arg.push(args[i])
    txt += parameter(ctx) + strings[i + 1]
  }
  return { txt: txt.trim(), arg }
}

const parameter = ctx => `$${++ctx.parameters}`

/** Transforms array of method call objects to SQL query string */
const compile = methods => {
  const ctx = context(methods)
  return query[ctx.type](ctx)
}

module.exports = compile
