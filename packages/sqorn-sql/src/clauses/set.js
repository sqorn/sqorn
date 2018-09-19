const { isTaggedTemplate, buildTaggedTemplate, snakeCase } = require('../util')

module.exports = ctx => {
  if (!ctx.set) return
  const txt = set(ctx, ctx.set)
  return txt && 'set ' + txt
}

const set = ctx => {
  const updates = ctx.set
  let txt = ''
  for (let i = 0; i < updates.length; ++i) {
    if (i !== 0) txt += ', '
    txt += change(ctx, updates[i])
  }
  return txt
}

const change = (ctx, args) => {
  if (isTaggedTemplate(args)) {
    return buildTaggedTemplate(ctx, args)
  } else if (typeof args[0] === 'object') {
    return objectChange(ctx, args[0])
  }
  throw Error('Invalid args:', args)
}

const objectChange = (ctx, obj) => {
  const keys = Object.keys(obj)
  let txt = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildCondition(ctx, obj, keys[i])
  }
  return txt
}

const buildCondition = (ctx, obj, key) => {
  const val = obj[key]
  return (
    snakeCase(key) +
    ' = ' +
    (typeof val === 'function' ? val.bld(ctx).text : ctx.parameter(ctx, val))
  )
}
