const {
  isTaggedTemplate,
  buildTaggedTemplate,
  snakeCase
} = require('./helpers')

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
  switch (typeof arg) {
    case 'string':
      return arg
    case 'object':
      return objectTables(ctx, arg)
    case 'function':
      return arg.bld(ctx).text
    default:
      throw Error('Invalid expression:', arg)
  }
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
  if (typeof source === 'string') {
    return `${source} as ${snakeCase(alias)}`
  } else if (typeof source.bld === 'function') {
    return `(${source.bld(ctx).text}) as ${snakeCase(alias)}`
  }
  return `${ctx.parameter(ctx, source)} as ${snakeCase(alias)}`
}

module.exports = { expressions }
