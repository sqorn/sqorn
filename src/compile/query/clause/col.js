const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.ins) return
  const txt = build(ctx, ctx.ins)
  return txt && '(' + txt + ')'
}
