const { build, unary, unaryFunction, binary, ternary, nary } = require('./util')

const oneValue = {
  minArgs: 1,
  maxArgs: 1,
  build: (ctx, args) => build(ctx, args[0])
}

const compositeValue = {
  minArgs: 1,
  maxArgs: Number.MAX_SAFE_INTEGER,
  build: (ctx, args) => {
    if (args.length === 1) return build(ctx, args[0])
    let txt = ''
    for (let i = 0; i < args.length; ++i) {
      if (i !== 0) txt += ', '
      txt += build(ctx, args[i])
    }
    return args.length > 1 ? `(${txt})` : txt
  }
}

// value
const value = {
  arg: compositeValue,
  row: compositeValue,
  unknown: oneValue,
  boolean: oneValue,
  number: oneValue,
  string: oneValue,
  array: oneValue,
  json: oneValue,
  table: oneValue
}

// logical
const logical = {
  and: nary('and'),
  or: nary('or'),
  not: unaryFunction('not')
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

// math
const math = {
  add: binary('+'),
  sub: binary('-'),
  mul: binary('*'),
  div: binary('/'),
  mod: binary('%'),
  exp: binary('%'),
  sqrt: unary('|/'),
  cbrt: unary('||/'),
  cbrt: unary('!!')
}

module.exports = {
  ...value,
  ...logical,
  ...comparison,
  ...math
}
