const { isBuilder } = require('../constants')

// Compile Tagged Template Literals

const isTaggedTemplate = args =>
  Array.isArray(args) &&
  Array.isArray(args[0]) &&
  typeof args[0][0] === 'string'

const parameter = ctx => `$${++ctx.parameters}`

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = strings[0]
  const arg = []
  for (let i = 0; i < args.length; i++) {
    const argument = args[i]
    // console.log(Object.keys(argument.__proto__))
    if (argument[isBuilder]) {
      // merge subquery argument
      const subqry = argument.qry(ctx)
      ctx.parameters += arg.length
      arg.push(...subqry.arg)
      txt += subqry.txt + strings[i + 1]
    } else {
      // parameterize argument
      arg.push(argument)
      txt += parameter(ctx) + strings[i + 1]
    }
  }
  return { txt: txt.trim(), arg }
}

// TODO: should prob be merged into buildTaggedTemplate
const buildRawTemplate = ([strings, ...args]) => {
  let txt = strings[0]
  for (let i = 0; i < args.length; i++) {
    txt += args[i] + strings[i + 1]
  }
  return { txt, arg: [] }
}

const build = (ctx, params) => {
  if (isTaggedTemplate(params)) {
    return buildTaggedTemplate(ctx, params)
  } else {
    throw Error('Cant build plain function calls yet')
  }
}

// clause helpers

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

// shared clauses

const With = ctx => undefined
const From = OptionalClause('from', 'frm')
const Where = OptionalClause('where', 'whr')
const Returning = OptionalClause('returning', 'ret')

// select clauses

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

// delete clauses

const Delete = ctx => ({ txt: 'delete', arg: [] })

// insert clauses

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

// update clauses

const Update = RequiredClause('update', 'frm')
const Set_ = RequiredClause('set', 'upd')

// Escaped SQL
const SQL = ctx => build(ctx, ctx.l)

// Raw SQL
const Raw = ctx => buildRawTemplate(ctx.raw)

// Construct Query from clauses

const Query = (...clauses) => ctx => {
  const txt = []
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

// prettier-ignore
/**
 * Each property of query is a function that converts a context object to a
 * complete parameterized query
 */
const query = {
  select: Query(
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
  delete: Query(
    With,
    Delete,
    From,
    Where,
    Returning
  ),
  insert: Query(
    With,
    Insert,
    Values,
    Returning
  ),
  update: Query(
    Update,
    Set_,
    Where,
    Returning
  ),
  sql: Query(
    SQL
  ),
  raw: Query(
    Raw
  )
}

module.exports = query
