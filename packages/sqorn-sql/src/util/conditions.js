const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

const buildCalls = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    const cond = calls[i]
    if (i !== 0) txt += ` ${cond.type} `
    txt += `(${buildCall(ctx, cond.args)})`
  }
  return txt
}

const buildCall = (ctx, args) =>
  isTaggedTemplate(args) ? buildTaggedTemplate(ctx, args) : buildArgs(ctx, args)

const buildArgs = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ' or '
    txt += buidArg(ctx, args[i])
  }
  return txt
}

const buidArg = (ctx, arg) => {
  if (arg !== null && !Array.isArray(arg) && typeof arg === 'object')
    return buildObject(ctx, arg)
  if (typeof arg === 'function') return ctx.build(arg)
  throw Error('Invalid condition of type:', arg)
}

const buildObject = (ctx, obj) => {
  const keys = Object.keys(obj)
  let txt = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ' and '
    txt += buildCondition(ctx, obj, keys[i])
  }
  return txt
}

const buildCondition = (ctx, obj, key) => {
  const val = obj[key]
  if (typeof val === 'function') {
    const subquery = val._build(ctx)
    return subquery.type === 'arg'
      ? `${ctx.mapKey(key)} = ${subquery.text}`
      : subquery.text
  }
  return `${ctx.mapKey(key)} = ${ctx.parameter(val)}`
}

module.exports = { conditions: buildCalls }
