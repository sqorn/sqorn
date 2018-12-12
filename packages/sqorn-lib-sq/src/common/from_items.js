const { isObject, buildCall, mapJoin, objectMapJoin } = require('@sqorn/lib-util')
const conditions = require('./conditions')
const valuesArray = require('./values_array')

module.exports = (ctx, froms, start = 0, end = froms.length) => {
  if (end > froms.length) end = froms.length
  let txt = ''
  for (let i = start; i < end; ++i) {
    const from = froms[i]
    const isJoin = from.join
    if (i !== start) txt += isJoin ? join(from) : ', '
    txt += fromItem(ctx, from.args)
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

const usingArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  throw Error('Error: Invalid .using arg')
}
const using = mapJoin(buildCall(mapJoin(usingArg)))

const fromArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (isObject(arg)) return buildObject(ctx, arg)
  throw Error('Error: Invalid .from argument:', arg)
}

const buildProperty = (ctx, key, value) => {
  if (typeof value === 'string') return `${value} as ${ctx.mapKey(key)}`
  if (typeof value === 'function')
    return `${ctx.build(value)} as ${ctx.mapKey(key)}`
  if (Array.isArray(value)) {
    const { columns, values } = valuesArray(ctx, value)
    return `(${values}) as ${ctx.mapKey(key)}(${columns})`
  }
  throw Error('Error: Invalid .from argument')
}

const buildObject = objectMapJoin(buildProperty)
const fromItem = buildCall(mapJoin(fromArg))
