const { join } = require('../util')

module.exports = ctx => {
  if (!ctx.returning) return
  const txt = join(ctx, ctx.returning)
  return txt && `returning ${txt}`
}
