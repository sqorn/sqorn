const { isTaggedTemplate, buildTaggedTemplate } = require('../util')

module.exports = ctx => {
  if (ctx.grp.length === 0) return
  const txt = buildCalls(ctx, ctx.grp)
  return txt && `group by ${txt}`
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
  if (typeof arg === 'function') return arg._build(ctx).text
  if (Array.isArray(arg)) return buildArrayArg(ctx, arg)
  if (arg !== null && typeof arg === 'object') return buildObject(ctx, arg)
  throw Error('Invalid order by argument:', arg)
}

const buildArrayArg = (ctx, array) => {
  let txt = '('
  for (let i = 0; i < array.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildArg(ctx, array[i])
  }
  return txt + `)`
}

// postgres only
// clone of buildArg() without support for object args
const buildCubeOrRollupArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return arg._build(ctx).text
  if (Array.isArray(arg)) return buildCubeOrRollupArrayArg(ctx, arg)
  throw Error('Invalid cube/rollup argument')
}

// postgres only
// clone of buildArrayArg() without support for object args
const buildCubeOrRollupArrayArg = (ctx, array) => {
  let txt = '('
  for (let i = 0; i < array.length; ++i) {
    if (i !== 0) txt += ', '
    txt += buildCubeOrRollupArg(ctx, array[i])
  }
  return txt + `)`
}

// postgres only
const buildObject = (ctx, obj) => {
  const { type, args } = obj
  if (type === 'rollup') {
    return `rollup ${buildCubeOrRollupArg(ctx, args)}`
  } else if (type === 'cube') {
    return `cube ${buildCubeOrRollupArg(ctx, args)}`
  } else if (type === 'grouping sets') {
    return `grouping sets ${buildArg(ctx, args)}`
  }
  throw Error('Invalid group by argument')
}
