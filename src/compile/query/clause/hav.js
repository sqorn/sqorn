const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.hav) return
  const { txt, arg } = build(ctx, ctx.hav)
  return {
    txt: `having ${txt}`,
    arg
  }
}
