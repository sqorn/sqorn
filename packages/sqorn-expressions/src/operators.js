const { build, unary, binary, ternary, nary } = require('./util')

// value
const value = {
  arg: {
    name: 'arg',
    minArgs: 1,
    maxArgs: Number.MAX_SAFE_INTEGER,
    build: (ctx, args) => {
      let txt = ''
      for (let i = 0; i < args.length; ++i) {
        if (i !== 0) txt += ', '
        txt += build(ctx, args[i])
      }
      return args.length > 1 ? `(${txt})` : txt
    }
  }
}

// logical
const logical = {
  and: nary('and', 'and'),
  or: nary('or', 'or'),
  not: unary('not', 'not')
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
  in: binary('in', 'in')
}

module.exports = {
  build,
  ...value,
  ...logical,
  ...comparison
}
