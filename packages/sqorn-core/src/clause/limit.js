const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.limit) return
  const txt = build(ctx, ctx.limit)
  return txt && `limit ${txt}`
}
