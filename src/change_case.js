// MIT License, Copyright (c) 2016 angus croll
// https://github.com/angus-c/just/blob/master/packages/string-snake-case/index.js
// https://github.com/angus-c/just/blob/master/packages/string-camel-case/index.js

const wordSeparators = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/
const capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g
const basicCamelRegEx = /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/
const fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g
const allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/

const snakeCase = str => {
  // HACK: if user enters name with parentheses, return string is
  // TODO: intelligently handle snakecasing components
  return str.indexOf('(') === -1
    ? str
        .split('.')
        .map(s => justSnakeCase(s))
        .join('.')
    : str
}

const justSnakeCase = str => {
  str = str.replace(capitals, match => ' ' + (match.toLowerCase() || match))
  return str
    .trim()
    .split(wordSeparators)
    .join('_')
}

const camelCase = str => {
  const words = str.split(wordSeparators)
  const len = words.length
  const mappedWords = new Array(len)
  for (let i = 0; i < len; i++) {
    let word = words[i]
    if (word === '') {
      continue
    }
    let isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word)
    if (isCamelCase) {
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, (match, p1, offset) =>
        deCap(match, word.length - offset - match.length == 0)
      )
    }
    let firstLetter = word[0]
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
    mappedWords[i] =
      firstLetter + (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1))
  }
  return mappedWords.join('')
}

const deCap = (match, endOfWord) => {
  const arr = match.split('')
  const first = arr.shift().toUpperCase()
  const last = endOfWord ? arr.pop().toLowerCase() : arr.pop()
  return first + arr.join('').toLowerCase() + last
}

// included to mitigate cost of case conversion
const memoize = fn => {
  const cache = {}
  return key => cache[key] || (cache[key] = fn(key))
}

module.exports = {
  snakeCase,
  camelCase,
  memoize
}
