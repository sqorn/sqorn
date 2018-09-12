const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.lim) return
  const txt = build(ctx, ctx.lim)
  return txt && `limit ${txt}`
}
