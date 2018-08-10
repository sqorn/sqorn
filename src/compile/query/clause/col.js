const { build } = require('./util')

module.exports = ctx => {
  if (!ctx.ins) return
  const { txt, arg } = build(ctx, ctx.ins)
  return {
    txt: `(${txt})`,
    arg
  }
}
