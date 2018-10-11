const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const { offset } = ctx
  const arg = offset[0]
  if (arg === undefined) return ''
  let txt = 'offset '
  if (typeof arg === 'number') txt += ctx.parameter(ctx, arg)
  else if (typeof arg === 'function') txt += arg._build(ctx).text
  else txt += buildTaggedTemplate(ctx, offset)
  return txt
}
