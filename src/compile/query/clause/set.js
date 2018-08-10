const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.upd) return
  const { txt, arg } = build(ctx, ctx.upd)
  return {
    txt: `set ${txt}`,
    arg
  }
}
