const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.ord) return
  const txt = build(ctx, ctx.ord)
  return txt && `order by ${txt}`
}
