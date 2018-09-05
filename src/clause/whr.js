const {
  parameter,
  isTaggedTemplate,
  buildTaggedTemplate,
  snakeCase
} = require('./util')

// 1. tagged template
// 2. ...[c in conditions] where c in:
//    a. call to sq.whr, sq.and, sq.or, or sq.not
//    b. object argument
module.exports = ctx => {
  if (ctx.whr.length === 0) return
  const txt = whereConditions(ctx)
  return txt && 'where ' + txt
}

const whereConditions = ctx => {
  const calls = ctx.whr
  if (calls.length === 0) return ''
  let txt = whereCondition(ctx, calls[0])
  for (let i = 1; i < calls.length; ++i) {
    txt += ' and ' + whereCondition(ctx, calls[i])
  }
  return txt
}

const whereCondition = (ctx, call) =>
  isTaggedTemplate(call)
    ? buildTaggedTemplate(ctx, call)
    : argsConditions(ctx, call)

// conditions for each argument of a function call
const argsConditions = (ctx, args) => {
  if (args.length === 0) return ''
  let txt = argCondition(ctx, args[0])
  for (let i = 1; i < args.length; ++i) {
    txt += ' or ' + argCondition(ctx, args[i])
  }
  return txt
}

const argCondition = (ctx, arg) => {
  if (typeof arg === 'object') {
    return objectConditions(ctx, arg)
  } else {
    throw Error('unimplemented')
  }
}

// conditions for each property of an object
const objectConditions = (ctx, obj) => {
  const keys = Object.keys(obj)
  if (keys.length === 0) return ''
  let txt = buildCondition(ctx, obj, keys[0])
  for (let i = 1; i < keys.length; ++i) {
    txt += ' and ' + buildCondition(ctx, obj, keys[i])
  }
  return txt
}

const buildCondition = (ctx, obj, key) => {
  const val = obj[key]
  return typeof val === 'function'
    ? val.bld(ctx).txt
    : snakeCase(key) + ' = ' + parameter(ctx, val)
}
