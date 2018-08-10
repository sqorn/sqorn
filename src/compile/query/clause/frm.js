const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.frm) return
  const { txt, arg } = build(ctx, ctx.frm)
  return {
    txt: `from ${txt}`,
    arg
  }
}
