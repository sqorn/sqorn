const { isTaggedTemplate, buildTaggedTemplate } = require('@sqorn/lib-util')
const fromItems = require('../common/from_items')
const valuesArray = require('../common/values_array')

module.exports = ctx => {
  const table = fromItems(ctx, ctx.frm)
  const values = buildCall(ctx, ctx.insert)
  return `insert into ${table}${values}`
}

const buildCall = (ctx, args) => {
  if (isTaggedTemplate(args)) return ' ' + buildTaggedTemplate(ctx, args)
  if (args.length === 1 && args[0] === undefined) return ' default values'
  if (Array.isArray(args[0])) return buildValuesArray(ctx, args[0])
  if (typeof args[0] === 'function') return ' ' + ctx.build(args[0])
  return buildValuesArray(ctx, args)
}

const buildValuesArray = (ctx, array) => {
  const { values, columns } = valuesArray(ctx, array)
  return `(${columns}) ${values}`
}
