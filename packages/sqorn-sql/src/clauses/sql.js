const { isTaggedTemplate, buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  const calls = ctx.sql
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ctx.separator
    txt += sql(ctx, calls[i])
  }
  return txt
}

const sql = (ctx, { args, raw }) => {
  const isTemplateString = isTaggedTemplate(args)
  return raw
    ? isTemplateString
      ? unescapedTemplateString(args)
      : args[0]
    : isTaggedTemplate(args)
      ? buildTaggedTemplate(ctx, args)
      : ctx.parameter(ctx, args[0])
}

const unescapedTemplateString = ([strings, ...args]) => {
  let txt = ''
  for (let i = 0; i < strings.length; ++i) {
    if (i !== 0) txt += args[i - 1]
    txt += strings[i]
  }
  return txt
}
