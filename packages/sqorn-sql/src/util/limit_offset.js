const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

module.exports = (ctx, args) => {
  if (isTaggedTemplate(args)) return buildTaggedTemplate(ctx, args)
  const arg = args[0]
  if (typeof arg === 'number') return ctx.parameter(arg)
  if (typeof arg === 'function') return ctx.build(arg)
}
