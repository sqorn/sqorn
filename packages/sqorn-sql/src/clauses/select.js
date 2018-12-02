const { expressions } = require('../util')

module.exports = ctx => {
  let txt = 'select '
  txt += buildDistinct(ctx)
  txt += expressions(ctx, ctx.ret) || '*'
  return txt
}

const buildDistinct = ctx =>
  ctx.distinct
    ? ctx.distinct.length
      ? // TODO: expressions shouldn't be aliasable here
        `distinct on (${expressions(ctx, ctx.distinct)})`
      : 'distinct'
    : ''
