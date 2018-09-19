const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.lim) return
  const txt = buildTaggedTemplate(ctx, ctx.lim)
  return txt && `limit ${txt}`
}
