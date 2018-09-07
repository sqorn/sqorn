const { build } = require('./util')

module.exports = ctx => {
  const txt = build(ctx, ctx.frm)
  return txt && `delete from ${txt}`
}
