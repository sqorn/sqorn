const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

const expressions = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildCall(ctx, calls[i])
  }
  return txt
}

const buildCall = (ctx, args) =>
  isTaggedTemplate(args) ? buildTaggedTemplate(ctx, args) : buildArgs(ctx, args)

const buildArgs = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildArg(ctx, args[i])
  }
  return txt
}

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (arg !== null && !Array.isArray(arg) && typeof arg === 'object')
    return buildObject(ctx, arg)
  if (typeof arg === 'function') return ctx.build(arg)
  return ctx.parameter(arg)
}

const buildObject = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    const expression = buildExpression(ctx, object[key])
    txt += `${expression} as ${ctx.mapKey(key)}`
  }
  return txt
}

const buildExpression = (ctx, source) => {
  if (typeof source === 'string') return source
  if (typeof source === 'function') return ctx.build(source)
  return ctx.parameter(source)
}

module.exports = { expressions }
