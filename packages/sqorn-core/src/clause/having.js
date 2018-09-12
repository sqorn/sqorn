const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.having) return
  const txt = build(ctx, ctx.having)
  return txt && `having ${txt}`
}
