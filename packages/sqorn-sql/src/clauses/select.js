const { expressions } = require('../util')

module.exports = ctx =>
  `select${ctx.distinct ? ' distinct' : ''} ${expressions(ctx, ctx.ret) || '*'}`
