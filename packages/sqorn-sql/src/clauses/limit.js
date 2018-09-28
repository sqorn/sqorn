const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const { limit } = ctx
  const arg = limit[0]
  if (arg === undefined) return ''
  let txt = 'limit '
  if (typeof arg === 'number') txt += ctx.parameter(ctx, arg)
  else if (typeof arg === 'function') txt += arg.bld(ctx).text
  else txt += buildTaggedTemplate(ctx, limit)
  return txt
}
