const { join } = require('../util')

module.exports = ctx => {
  const txt = join(ctx, ctx.from)
  return txt && `delete from ${txt}`
}
