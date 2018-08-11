const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.frm) return
  const txt = build(ctx, ctx.frm)
  return txt && 'delete from ' + txt
}
