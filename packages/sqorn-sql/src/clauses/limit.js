const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const { limit } = ctx
  const firstArg = limit[0]
  return (
    firstArg !== undefined &&
    `limit ${
      typeof firstArg === 'number'
        ? ctx.parameter(ctx, firstArg)
        : buildTaggedTemplate(ctx, ctx.limit)
    }`
  )
}
