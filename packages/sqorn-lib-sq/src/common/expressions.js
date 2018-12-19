const {
  isObject,
  buildCall,
  mapJoin,
  objectMapJoin
} = require('@sqorn/lib-util')

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (isObject(arg)) return buildObject(ctx, arg)
  return ctx.build(arg)
}

const buildProperty = (ctx, key, value) => {
  const expression = typeof value === 'string' ? value : ctx.build(value)
  return `${expression} ${ctx.mapKey(key)}`
}

const buildObject = objectMapJoin(buildProperty)
module.exports = mapJoin(buildCall(mapJoin(buildArg)))
