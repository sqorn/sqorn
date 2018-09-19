const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.off) return
  const txt = buildTaggedTemplate(ctx, ctx.off)
  return txt && `offset ${txt}`
}
