const { buildCall, mapJoin, objectMapJoin } = require('sqorn-util')

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
    return buildObject(ctx, arg)
  }
  return ctx.build(arg)
}

const buildProperty = (ctx, key, value) => {
  const expression = typeof value === 'string' ? value : ctx.build(value)
  return `${expression} as ${ctx.mapKey(key)}`
}

const buildObject = objectMapJoin(buildProperty)
module.exports = mapJoin(buildCall(mapJoin(buildArg)))
