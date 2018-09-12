const lodashCamelCase = require('lodash.camelcase')
const lodashSnakeCase = require('lodash.snakecase')

const camelCaseCache = {}
const camelCase = str =>
  camelCaseCache[str] || (camelCaseCache[str] = lodashCamelCase(str))

const snakeCaseCache = {}
const snakeCase = str =>
  snakeCaseCache[str] ||
  (snakeCaseCache[str] = str
    .split('.')
    .map(s => lodashSnakeCase(s))
    .join('.'))

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
      txt += prevString + ctx.parameter(ctx, arg)
    }
  }
  return txt + strings[i]
}

const join = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += build(ctx, calls[i])
  }
  return txt
}

const build = (ctx, args) => {
  if (args === undefined) {
    // no from clause
    return ''
  } else if (typeof args[0] === 'string') {
    // string table names
    return args.join(', ')
  } else if (isTaggedTemplate(args)) {
    // template string tables
    return buildTaggedTemplate(ctx, args)
  } else {
    return objectTables(ctx, args[0])
    // object tables
  }
}

const objectTables = (ctx, obj) => {
  let txt = ''
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += `${obj[key]} as ${key}`
  }
  return txt
}

module.exports = {
  camelCase,
  snakeCase,
  isTaggedTemplate,
  buildTaggedTemplate,
  build,
  join
}
