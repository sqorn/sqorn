const { isTaggedTemplate, buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.set) return
  const txt = buildCalls(ctx, ctx.set)
  return txt && 'set ' + txt
}

const buildCalls = ctx => {
  const updates = ctx.set
  let txt = ''
  for (let i = 0; i < updates.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildCall(ctx, updates[i])
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
  if (typeof arg === 'function') {
    const { type, text } = arg._build(ctx)
    return type === 'manual' ? text : `(${text})`
  }
  return ctx.parameter(ctx, arg)
}
