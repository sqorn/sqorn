const {
  isTaggedTemplate,
  buildTaggedTemplate,
  snakeCase
} = require('./helpers')

const conditions = ctx => {
  let txt = ''
  const calls = ctx.whr
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ' and '
    txt += condition(ctx, calls[i].args)
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
  if (typeof arg === 'object') {
    return objectConditions(ctx, arg)
  } else {
    throw Error('unimplemented')
  }
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
  return typeof val === 'function'
    ? val.bld(ctx).text
    : snakeCase(key) + ' = ' + ctx.parameter(ctx, val)
}

module.exports = { conditions }
