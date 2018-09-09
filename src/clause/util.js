const lodashSnakeCase = require('lodash.snakecase')

const parameter = (ctx, val) =>
  val === undefined ? 'default' : `$${ctx.arg.push(val)}`

const isTaggedTemplate = args =>
  Array.isArray(args[0]) && typeof args[0][0] === 'string'

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let i = 0
  let txt = ''
  for (; i < args.length; ++i) {
    const arg = args[i]
    const prevString = strings[i]
    const lastCharIndex = prevString.length - 1
    if (prevString[lastCharIndex] === '$') {
      // raw arg
      txt += prevString.substr(0, lastCharIndex) + args[i]
    } else if (arg && typeof arg.bld === 'function') {
      // sql builder arg
      txt += prevString + arg.bld(ctx).text
    } else {
      // parameterized arg
      txt += prevString + parameter(ctx, arg)
    }
  }
  return txt + strings[i]
}

const build = (ctx, args) => {
  if (args === undefined) {
    // no from clause
    return undefined
  } else if (typeof args[0] === 'string') {
    // string table names
    return args.join(', ')
  } else if (isTaggedTemplate(args)) {
    // template string tables
    return buildTaggedTemplate(ctx, args)
  }
  throw Error('Invalid args:', args)
}

const join = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += build(ctx, calls[i])
  }
  return txt
}

const snakeCaseCache = {}
const snakeCase = str =>
  snakeCaseCache[str] ||
  (snakeCaseCache[str] = str
    .split('.')
    .map(s => lodashSnakeCase(s))
    .join('.'))

module.exports = {
  parameter,
  isTaggedTemplate,
  buildTaggedTemplate,
  build,
  join,
  snakeCase
}
