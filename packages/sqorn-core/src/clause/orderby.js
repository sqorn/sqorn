const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.orderby) return
  const txt = build(ctx, ctx.orderby)
  return txt && `order by ${txt}`
}
