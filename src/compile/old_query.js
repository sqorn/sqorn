const { isBuilder } = require('../constants')
const where = require('./clause/where')
const snakeCase = require('lodash.snakecase')
const camelCase = require('lodash.camelcase')

// Compile Tagged Template Literals

const isTaggedTemplate = args =>
  Array.isArray(args) &&
  Array.isArray(args[0]) &&
  typeof args[0][0] === 'string'

const parameter = ctx => `$${++ctx.parameters}`

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = ''
  const arg = []
  let i = 0
  for (; i < args.length; i++) {
    const argument = args[i]
    if (argument[isBuilder]) {
      // merge subquery argument
      const subqry = argument.bld(ctx)
      ctx.parameters += arg.length
      arg.push(...subqry.arg)
      txt += strings[i] + subqry.txt
    } else {
      const prevString = strings[i]
      if (prevString[prevString.length - 1] === '$') {
        // raw argument
        txt += prevString.substr(0, prevString.length - 1) + args[i]
      } else {
        // parameterize argument
        arg.push(argument)
        txt += strings[i] + parameter(ctx)
      }
    }
  }
  return { txt: (txt + strings[i]).trim(), arg }
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

// 1. tagged template
// 2. ...[c in conditions] where c in:
//    a. call to sq.whr, sq.and, sq.or, or sq.not
//    b. object argument
const Where = ctx => {
  if (ctx.whr.length === 0) return
  const txt = []
  const arg = []
  ctx.whr.forEach(whr => {
    const condition = buildWhere(ctx, whr)
    txt.push(condition.txt)
    arg.push(...condition.arg)
  })
  return { txt: `where ${txt.join(' and ')}`, arg }
  // tagged template c
}

const buildWhere = (ctx, whr) => {
  if (isTaggedTemplate(whr)) return buildTaggedTemplate(ctx, whr)
  return buildWhereConditions(ctx, whr)
}

const buildWhereConditions = (ctx, whr) => {
  const txt = []
  const arg = []
  whr.forEach(obj => {
    if (typeof obj === 'object') {
      const conditions = buildWhereObject(ctx, obj)
      txt.push(conditions.txt)
      arg.push(...conditions.arg)
    } else {
      throw Error('unimplemented')
    }
  })
  return {
    txt: txt.join(' or '),
    arg
  }
}

const buildWhereObject = (ctx, obj) => {
  const txt = []
  const arg = []
  Object.keys(obj).forEach(key => {
    txt.push(`${snakeCase(key)} = ${parameter(ctx)}`)
    arg.push(obj[key])
  })
  return {
    txt: txt.join(' and '),
    arg
  }
}

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

const Insert = OptionalClause('insert into', 'frm')

const Columns = ctx => {
  if (!ctx.ins) return
  const ins = build(ctx, ctx.ins)
  return {
    txt: `(${ins.txt})`,
    arg: ins.arg
  }
}

const Values = ctx => {
  if (ctx.val.length == 0) return
  const txt = []
  const arg = []
  ctx.val.forEach(val => {
    const tuple = build(ctx, val)
    txt.push(`(${tuple.txt})`)
    arg.push(...tuple.arg)
  })
  return {
    txt: `values ${txt.join(', ')}`,
    arg
  }
}

// update clauses

const Update = OptionalClause('update', 'frm')
const Set_ = OptionalClause('set', 'upd')

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
    where,
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
    where,
    Returning
  ),
  insert: Query(
    With,
    Insert,
    Columns,
    Values,
    Returning
  ),
  update: Query(
    Update,
    Set_,
    where,
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
