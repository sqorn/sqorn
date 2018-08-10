const snakeCase = require('lodash.snakecase')
const camelCase = require('lodash.camelcase')
const { isTaggedTemplate, buildTaggedTemplate } = require('./util')

// 1. tagged template
// 2. ...[c in conditions] where c in:
//    a. call to sq.whr, sq.and, sq.or, or sq.not
//    b. object argument
module.exports = ctx => {
  if (ctx.whr.length === 0) return
  const txt = []
  const arg = []
  ctx.whr.forEach(whr => {
    const condition = buildWhere(ctx, whr)
    txt.push(condition.txt)
    arg.push(...condition.arg)
  })
  return { txt: `where ${txt.join(' and ')}`, arg }
}

const buildWhere = (ctx, whr) => {
  if (isTaggedTemplate(whr)) return buildTaggedTemplate(ctx, whr)
  return buildWhereConditions(ctx, whr)
}

const buildWhereConditions = (ctx, whr) => {
  const txt = []
  const arg = []
  whr.forEach(obj => {
    if (typeof obj === 'object') {
      const conditions = buildWhereObject(ctx, obj)
      txt.push(conditions.txt)
      arg.push(...conditions.arg)
    } else {
      throw Error('unimplemented')
    }
  })
  return {
    txt: txt.join(' or '),
    arg
  }
}

const buildWhereObject = (ctx, obj) => {
  const txt = []
  const arg = []
  Object.keys(obj).forEach(key => {
    txt.push(`${snakeCase(key)} = ${parameter(ctx)}`)
    arg.push(obj[key])
  })
  return {
    txt: txt.join(' and '),
    arg
  }
}
