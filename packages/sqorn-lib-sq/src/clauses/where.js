const conditions = require('../common/conditions')

module.exports = ctx => {
  if (ctx.whr.length === 0) return
  const txt = conditions(ctx, ctx.whr)
  return txt && 'where ' + txt
}
