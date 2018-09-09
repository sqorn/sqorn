const { join } = require('./util')

module.exports = ctx => {
  const txt = join(ctx, ctx.frm)
  return txt && `update ${txt}`
}
