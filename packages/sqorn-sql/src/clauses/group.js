const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (!ctx.grp) return
  const txt = buildTaggedTemplate(ctx, ctx.grp)
  return txt && `group by ${txt}`
}
