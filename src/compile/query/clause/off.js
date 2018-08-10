const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.off) return
  const { txt, arg } = build(ctx, ctx.off)
  return {
    txt: `offset ${txt}`,
    arg
  }
}
