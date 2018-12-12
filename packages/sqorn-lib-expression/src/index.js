const { build, unary, binary, ternary, nary } = require('./util')

// value
const value = {
  arg: {
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
  and: nary('and'),
  or: nary('or'),
  not: unary('not')
}

// comparison
const comparison = {
  eq: binary('='),
  neq: binary('<>'),
  lt: binary('<'),
  gt: binary('>'),
  lte: binary('<='),
  gte: binary('>='),
  between: ternary('between', 'and'),
  notBetween: ternary('not between', 'and'),
  in: binary('in')
}

module.exports = {
  ...value,
  ...logical,
  ...comparison
}
