const { join } = require('./util')

module.exports = ctx => {
  if (!ctx.ret) return
  const txt = join(ctx, ctx.ret)
  return txt && `returning ${txt}`
}
