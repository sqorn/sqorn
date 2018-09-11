const { isTaggedTemplate, buildTaggedTemplate, snakeCase } = require('./util')

module.exports = ctx => {
  if (!ctx.set) return
  const txt = set(ctx, ctx.set)
  return txt && 'set ' + txt
}

const set = ctx => {
  const updates = ctx.set
  let txt = change(ctx, updates[0])
  for (let i = 1; i < updates.length; ++i) {
    txt += ', ' + change(ctx, updates[i])
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
  if (keys.length === 0) return ''
  let txt = buildCondition(ctx, obj, keys[0])
  for (let i = 1; i < keys.length; ++i) {
    txt += ', ' + buildCondition(ctx, obj, keys[i])
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
