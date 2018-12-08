const { unary, binary, ternary, nary } = require('./util')

// logical
const logical = {
  and: nary('and'),
  or: nary('or'),
  not: unary('not')
}

// comparison
const comparison = {
  eq: binary('eq', '='),
  neq: binary('neq', '<>'),
  lt: binary('lt', '<'),
  gt: binary('gt', '>'),
  lte: binary('lte', '<='),
  gte: binary('gte', '>='),
  between: ternary('between', 'between', 'and'),
  notBetween: ternary('notBetween', 'not between', 'and'),
  in: binary('eq', 'in')
}

module.exports = {
  ...logical,
  ...comparison
}
