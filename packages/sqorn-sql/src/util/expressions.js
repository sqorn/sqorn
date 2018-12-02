const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

const expressions = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += build(ctx, calls[i])
  }
  return txt
}

const build = (ctx, args) =>
  isTaggedTemplate(args)
    ? buildTaggedTemplate(ctx, args)
    : expressionArgs(ctx, args)

const expressionArgs = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    txt += expressionArg(ctx, args[i])
  }
  return txt
}

const expressionArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'object') return objectTables(ctx, arg)
  if (typeof arg === 'function') return arg._build(ctx).text
  return ctx.parameter(ctx, arg)
}

const objectTables = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += expressionAsAlias(ctx, key, object[key])
  }
  return txt
}

const expressionAsAlias = (ctx, alias, source) => {
  let txt = ''
  if (typeof source === 'string') txt += source
  else if (typeof source === 'function') txt += source._build(ctx).text
  else txt += ctx.parameter(ctx, source)
  return `${txt} as ${ctx.mapKey(alias)}`
}

module.exports = { expressions }
