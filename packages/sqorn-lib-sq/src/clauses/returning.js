const expressions = require('../common/expressions')

module.exports = ctx => {
  if (!ctx.ret) return
  const txt = expressions(ctx, ctx.ret)
  return txt && `returning ${txt}`
}
