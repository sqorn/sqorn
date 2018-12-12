const {
  isObject,
  buildCall,
  mapJoin,
  objectMapJoin
} = require('@sqorn/lib-util')

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  console.log('may build object', arg)
  if (isObject(arg)) return buildObject(ctx, arg)
  console.log('building arg', arg)
  return ctx.build(arg)
}

const buildProperty = (ctx, key, value) => {
  const expression = typeof value === 'string' ? value : ctx.build(value)
  return `${expression} as ${ctx.mapKey(key)}`
}

const buildObject = objectMapJoin(buildProperty)
module.exports = mapJoin(buildCall(mapJoin(buildArg)))
