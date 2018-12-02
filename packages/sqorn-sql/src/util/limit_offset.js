const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')

module.exports = (ctx, args) => {
  if (isTaggedTemplate(args)) return buildTaggedTemplate(ctx, args)
  const arg = args[0]
  if (typeof arg === 'number') return ctx.parameter(ctx, arg)
  if (typeof arg === 'function') {
    const { text, type } = arg._build(ctx)
    return type === 'manual' ? text : `(${text})`
  }
}
