const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

const conditions = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    const cond = calls[i]
    if (i !== 0) txt += ` ${cond.type} `
    txt += condition(ctx, cond.args)
  }
  return txt
}

const condition = (ctx, call) =>
  `(${
    isTaggedTemplate(call)
      ? buildTaggedTemplate(ctx, call)
      : argsConditions(ctx, call)
  })`

// conditions for each argument of a function call
const argsConditions = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ' or '
    txt += argCondition(ctx, args[i])
  }
  return txt
}

const argCondition = (ctx, arg) => {
  if (typeof arg === 'object') return objectConditions(ctx, arg)
  else if (typeof arg === 'function') return arg._build(ctx).text
  throw Error('unimplemented')
}

// conditions for each property of an object
const objectConditions = (ctx, obj) => {
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
  return `${ctx.mapKey(key)} = ${ctx.parameter(ctx, val)}`
}

module.exports = { conditions }
