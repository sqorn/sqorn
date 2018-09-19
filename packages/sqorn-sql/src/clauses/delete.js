const { fromItems } = require('../util')

module.exports = ctx => {
  const txt = fromItems(ctx, ctx.frm)
  return txt && `delete from ${txt}`
}
