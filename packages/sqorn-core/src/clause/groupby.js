const { build } = require('../util')

module.exports = ctx => {
  if (!ctx.group) return
  const txt = build(ctx, ctx.group)
  return txt && `group by ${txt}`
}
