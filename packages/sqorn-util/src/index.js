const lodashCamelCase = require('lodash.camelcase')
const lodashSnakeCase = require('lodash.snakecase')

const camelCase = lodashCamelCase
const snakeCase = str => {
  // HACK: if user enters name with parentheses, return string as is
  // TODO: intelligently handle snakecasing components
  return str.indexOf('(') === -1
    ? str
        .split('.')
        .map(s => lodashSnakeCase(s))
        .join('.')
    : str
}

const memoize = fn => {
  const cache = {}
  return key => cache[key] || (cache[key] = fn(key))
}

module.exports = { camelCase, snakeCase, memoize }
