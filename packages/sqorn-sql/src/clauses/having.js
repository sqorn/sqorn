const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.hav) return
  const txt = buildTaggedTemplate(ctx, ctx.hav)
  return txt && `having ${txt}`
}
