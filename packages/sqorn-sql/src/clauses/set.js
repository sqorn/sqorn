const { buildCall, mapJoin } = require('../util')

module.exports = ctx => {
  if (!ctx.set) return
  const txt = calls(ctx, ctx.set)
  return txt && 'set ' + txt
}

const buildArg = (ctx, obj) => {
  let txt = ''
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const column = keys[i]
    const value = obj[column]
    txt += `${ctx.mapKey(column)} = ${buildColumn(ctx, value)}`
  }
  return txt
}

const buildColumn = (ctx, arg) => {
  if (typeof arg === 'function') return ctx.build(arg)
  return ctx.parameter(arg)
}

const calls = mapJoin(buildCall(mapJoin(buildArg)))
