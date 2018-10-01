const { isTaggedTemplate, buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (ctx.ord.length === 0) return
  const txt = buildCalls(ctx, ctx.ord)
  return txt && `order by ${txt}`
}

const buildCalls = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildCall(ctx, calls[i])
  }
  return txt
}

const buildCall = (ctx, args) =>
  isTaggedTemplate(args) ? buildTaggedTemplate(ctx, args) : buildArgs(ctx, args)

const buildArgs = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildArg(ctx, args[i])
  }
  return txt
}

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return arg.bld(ctx).text
  if (typeof arg === 'object') return buildObject(ctx, arg)
  throw Error('Invalid order by argument')
}

const buildObject = (ctx, obj) => {
  let txt = ''
  const { by, sort, nulls } = obj
  // by
  if (typeof by === 'string') txt += by
  else if (typeof by === 'function') txt += by.bld(ctx).text
  else throw Error('Invalid order by property "by"')
  // sort
  if (sort === undefined);
  else if (sort === 'desc') txt += ' desc'
  else if (sort === 'asc') txt += ' asc'
  else if (typeof sort === 'string') txt += ` using ${sort}`
  else throw Error('Invalid order by property "sort"')
  // nulls
  if (nulls === undefined);
  else if (nulls === 'last') txt += ' nulls last'
  else if (nulls === 'first') txt += ' nulls first'
  else throw Error('Invalid order by property "nulls"')
  // return
  return txt
}
