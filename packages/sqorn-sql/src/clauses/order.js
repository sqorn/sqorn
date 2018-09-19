const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.ord) return
  const txt = buildTaggedTemplate(ctx, ctx.ord)
  return txt && `order by ${txt}`
}
