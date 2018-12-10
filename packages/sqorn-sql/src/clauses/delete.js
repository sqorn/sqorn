const fromItems = require('../common/from_items')

module.exports = ctx => {
  const txt = fromItems(ctx, ctx.frm)
  return txt && `delete from ${txt}`
}
