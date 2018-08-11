const { build } = require('./util')

module.exports = ctx => {
  if (ctx.val.length == 0) return
  const txt = values(ctx)
  return txt && 'values ' + txt
}

const values = ctx => ctx.val.map(val => '(' + build(ctx, val) + ')').join(', ')
