const {
  isTaggedTemplate,
  buildTaggedTemplate,
  snakeCase
} = require('./helpers')
const { conditions } = require('./conditions')

// utilities for building from_items, see:
// https://www.postgresql.org/docs/9.5/static/sql-select.html

const fromItems = (ctx, froms) => {
  let txt = ''
  for (let i = 0; i < froms.length; ++i) {
    const from = froms[i]
    const isJoin = from.join
    if (i !== 0) txt += isJoin ? join(from) : ', '
    txt += fromItem(ctx, from)
    if (isJoin) txt += joinConditions(ctx, from)
  }
  return txt
}

const join = from =>
  `${from.on || from.using ? '' : ' natural'} ${joins[from.join]} `

const joins = {
  inner: 'join',
  left: 'left join',
  right: 'right join',
  full: 'full join',
  cross: 'cross join'
}

const joinConditions = (ctx, from) =>
  (from.on && ` on ${conditions(ctx, from.on)}`) ||
  (from.using && ` using (${using(ctx, from.using)})`) ||
  ''

const using = (ctx, using) => {
  let txt = ''
  for (let i = 0; i < using.length; ++i) {
    const args = using[i]
    if (i !== 0) txt += ', '
    if (typeof args[0] === 'string') {
      txt += args.join(', ')
    } else {
      txt += buildTaggedTemplate(ctx, args)
    }
  }
  return txt
}

const fromItem = (ctx, { args }) => {
  if (isTaggedTemplate(args)) return buildTaggedTemplate(ctx, args)
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    const arg = args[i]
    txt += typeof arg === 'string' ? arg : objectTables(ctx, arg)
  }
  return txt
}

const objectTables = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += table(ctx, key, object[key])
  }
  return txt
}

const table = (ctx, alias, source) => {
  if (typeof source === 'string') {
    return `${source} as ${snakeCase(alias)}`
  } else if (Array.isArray(source)) {
    return tableFromArray(ctx, alias, source)
  } else if (typeof source.bld === 'function') {
    return `(${source.bld(ctx).text}) as ${snakeCase(alias)}`
  }
  return `${ctx.parameter(ctx, source)} as ${snakeCase(alias)}`
}

const tableFromArray = (ctx, alias, source) => {
  // get unique columns
  const keys = uniqueKeysFromObjectArray(source)
  let columns = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) columns += ', '
    columns += snakeCase(keys[i])
  }
  // get values
  let values = ''
  for (let i = 0; i < source.length; ++i) {
    if (i !== 0) values += ', '
    values += '('
    const object = source[i]
    for (let j = 0; j < keys.length; ++j) {
      if (j !== 0) values += ', '
      values += ctx.parameter(ctx, object[keys[j]])
    }
    values += ')'
  }
  return `(values ${values}) as ${snakeCase(alias)}(${columns})`
}

const uniqueKeysFromObjectArray = array => {
  const keys = {}
  for (const object of array) {
    for (const key in object) {
      keys[key] = true
    }
  }
  return Object.keys(keys)
}

module.exports = { fromItems }
