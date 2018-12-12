const { isObject, buildCall, mapJoin, mapJoinWrap } = require('@sqorn/lib-util')

module.exports = ctx => {
  if (ctx.grp.length === 0) return
  const txt = calls(ctx, ctx.grp)
  return txt && `group by ${txt}`
}

const buildArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (Array.isArray(arg)) return buildArrayArg(ctx, arg)
  if (isObject(arg)) return buildObject(ctx, arg)
  throw Error('Invalid order by argument:', arg)
}

const buildArrayArg = mapJoinWrap(buildArg)

// postgres only
// clone of buildArg() without support for object args
const buildCubeOrRollupArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'function') return ctx.build(arg)
  if (Array.isArray(arg)) return buildCubeOrRollupArrayArg(ctx, arg)
  throw Error('Invalid cube/rollup argument')
}

// postgres only
// clone of buildArrayArg() without support for object args
const buildCubeOrRollupArrayArg = mapJoinWrap(buildCubeOrRollupArg)

// postgres only
const buildObject = (ctx, obj) => {
  const { type, args } = obj
  if (type === 'rollup') {
    return `rollup ${buildCubeOrRollupArg(ctx, args)}`
  }
  if (type === 'cube') {
    return `cube ${buildCubeOrRollupArg(ctx, args)}`
  }
  if (type === 'grouping sets') {
    return `grouping sets ${buildArg(ctx, args)}`
  }
  throw Error('Invalid group by argument')
}

const calls = mapJoin(buildCall(mapJoin(buildArg)))
