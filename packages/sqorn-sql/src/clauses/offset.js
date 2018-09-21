const { buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const { offset } = ctx
  const firstArg = offset[0]
  return (
    firstArg !== undefined &&
    `offset ${
      typeof firstArg === 'number'
        ? ctx.parameter(ctx, firstArg)
        : buildTaggedTemplate(ctx, ctx.offset)
    }`
  )
}
