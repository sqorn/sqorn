const { isObject, buildCall, mapJoin, objectMapJoin } = require('sqorn-util')

module.exports = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    const cond = calls[i]
    if (i !== 0) txt += ` ${cond.type} `
    txt += `(${call(ctx, cond.args)})`
  }
  return txt
}

const buildArg = (ctx, arg) =>
  isObject(arg) ? buildObject(ctx, arg) : ctx.build(arg)

const buildProperty = (ctx, key, value) => {
  if (typeof value === 'function') return ctx.build(value)
  return `${ctx.mapKey(key)} = ${ctx.build(value)}`
}

const buildObject = objectMapJoin(buildProperty, ' and ')
const call = buildCall(mapJoin(buildArg, ' or '))
