const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.ins) return
  const txt = build(ctx, ctx.ins)
  return txt && '(' + txt + ')'
}

const snakeCase = require('lodash.snakecase')
const { parameter, isTaggedTemplate, buildTaggedTemplate } = require('./util')

module.exports = ctx => {
  if (ctx.ins.length === 0) return
  // first call to insert determines what sort of arguments to accept:
  // 1. template string columns or individual string columns
  // 2. object columns + values
  if (typeof ctx.ins[0].args[0] === 'string') {
    // 1. string column names
  } else if (isTaggedTemplate(ctx.ins[0])) {
    // 2. template string template names
  } else {
    // 3. objects
  }
  const txt = whereConditions(ctx)
  return txt && '(' + txt + ')'
}

// multiple .whr calls
const whereConditions = ctx =>
  ctx.whr
    .map(
      call =>
        isTaggedTemplate(call)
          ? buildTaggedTemplate(ctx, call)
          : argumentsConditions(ctx, call)
    )
    .join(' and ')

// conditions for each argument of a function call
const argumentsConditions = (ctx, args) =>
  args
    .map(arg => {
      if (typeof arg === 'object') {
        return objectConditions(ctx, arg)
      } else {
        throw Error('unimplemented')
      }
    })
    .join(' or ')

// conditions for each property of an object
const objectConditions = (ctx, obj) =>
  Object.keys(obj)
    .map(key => snakeCase(key) + ' = ' + parameter(ctx, obj[key]))
    .join(' and ')
