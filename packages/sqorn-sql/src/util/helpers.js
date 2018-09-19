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

const isTaggedTemplate = args => {
  // the first argument of a tagged template literal is an array
  // of strings with a property raw that is an array of strings
  const [strings] = args
  return Array.isArray(strings) && Array.isArray(strings.raw)
}

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

module.exports = {
  camelCase,
  snakeCase,
  isTaggedTemplate,
  buildTaggedTemplate
}
