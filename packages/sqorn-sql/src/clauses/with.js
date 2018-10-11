const { isTaggedTemplate, buildTaggedTemplate, snakeCase } = require('../util')
const { uniqueKeys, columns, values } = require('../util/values_array')

module.exports = ctx => {
  if (ctx.with.length === 0) return
  const txt = buildCalls(ctx, ctx.with)
  return txt && `with ${ctx.recursive ? 'recursive ' : ''}${txt}`
}

const buildCalls = (ctx, calls) => {
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
  if (typeof arg === 'object') return buildObject(ctx, arg)
  throw Error('Invalid order by argument')
}

const buildObject = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += buildTable(ctx, key, object[key])
  }
  return txt
}

const buildTable = (ctx, alias, source) => {
  if (typeof source === 'function') {
    const query = source._build(ctx)
    return `${snakeCase(alias)} as (${query.text})`
  }
  if (Array.isArray(source)) {
    const keys = uniqueKeys(source)
    const alias_ = `${snakeCase(alias)}(${columns(keys)})`
    const table = values(ctx, source, keys)
    return `${alias_} as ${table}`
  }
  throw Error(`Invalid .with argument`)
}
