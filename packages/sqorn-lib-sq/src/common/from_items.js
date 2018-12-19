const {
  isObject,
  buildCall,
  mapJoin,
  objectMapJoin
} = require('@sqorn/lib-util')
const conditions = require('./conditions')
const valuesArray = require('./values_array')

module.exports = (ctx, items, start = 0, end = items.length) => {
  if (end > items.length) end = items.length
  let txt = ''
  for (let i = start; i < end; ++i) {
    const item = items[i]
    if (i !== start) txt += item.join
    txt += fromItem(ctx, item.args)
    if (item.on) txt += ` on ${conditions(ctx, item.on)}`
    else if (item.using) txt += ` using (${using(ctx, item.using)})`
  }
  return txt
}

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
  if (typeof value === 'string') return `${value} ${ctx.mapKey(key)}`
  if (typeof value === 'function')
    return `${ctx.build(value)} ${ctx.mapKey(key)}`
  if (Array.isArray(value)) {
    const { columns, values } = valuesArray(ctx, value)
    return `(${values}) ${ctx.mapKey(key)}(${columns})`
  }
  throw Error('Error: Invalid .from argument')
}

const buildObject = objectMapJoin(buildProperty)
const fromItem = buildCall(mapJoin(fromArg))
