const snakeCase = require('lodash.snakecase')
const { parameter, isTaggedTemplate, buildTaggedTemplate } = require('./util')

// 1. tagged template
// 2. ...[c in conditions] where c in:
//    a. call to sq.whr, sq.and, sq.or, or sq.not
//    b. object argument
module.exports = ctx => {
  if (ctx.whr.length === 0) return
  const txt = whereConditions(ctx)
  return txt && 'where ' + txt
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
