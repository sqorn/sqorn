const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.grp) return
  const { txt, arg } = build(ctx, ctx.grp)
  return {
    txt: `group by ${txt}`,
    arg
  }
}
