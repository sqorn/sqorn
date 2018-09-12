const { isTaggedTemplate, buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const args = ctx.sql
  if (args.length === 0) return ''
  let txt = sql(ctx, args[0])
  for (let i = 1; i < args.length; ++i) {
    txt += ' ' + sql(ctx, args[i])
  }
  return txt
}

const sql = (ctx, args) => {
  if (typeof args[0] === 'string') {
    return args[0]
  } else if (isTaggedTemplate(args)) {
    return buildTaggedTemplate(ctx, args)
  }
  throw Error(`Invalid sq.l arguments:`, args)
}
