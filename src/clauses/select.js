const expressions = require('../common/expressions')

module.exports = ctx =>
  `select ${buildDistinct(ctx)}${expressions(ctx, ctx.ret) || '*'}`

const buildDistinct = ctx =>
  ctx.distinct
    ? ctx.distinct.length
      ? // TODO: expressions shouldn't be aliasable here
        `distinct on (${expressions(ctx, ctx.distinct)})`
      : 'distinct'
    : ''
