const {
  isObject,
  buildCall,
  mapJoin,
  objectMapJoin
} = require('@sqorn/lib-util')
const valuesArray = require('../common/values_array')

module.exports = ctx => {
  if (ctx.with.length === 0) return
  const txt = calls(ctx, ctx.with)
  return txt && `with ${ctx.recursive ? 'recursive ' : ''}${txt}`
}

const buildArg = (ctx, arg) => {
  if (isObject(arg)) return buildObject(ctx, arg)
  throw Error('Invalid with argument:', arg)
}

const buildProperty = (ctx, key, value) => {
  if (typeof value === 'function') {
    return `${ctx.mapKey(key)} ${ctx.build(value)}`
  }
  if (Array.isArray(value)) {
    const { columns, values } = valuesArray(ctx, value)
    return `${ctx.mapKey(key)}(${columns}) (${values})`
  }
  throw Error(`Error: Invalid .with argument`)
}

const buildObject = objectMapJoin(buildProperty)
const calls = mapJoin(buildCall(mapJoin(buildArg)))
