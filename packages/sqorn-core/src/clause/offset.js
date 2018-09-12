const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.offset) return
  const txt = build(ctx, ctx.offset)
  return txt && `offset ${txt}`
}
