const { buildTaggedTemplate } = require('@sqorn/lib-util')

const build = (ctx, arg) => {
  // compiled expression string
  if (arg.exp) return arg.exp
  // tagged template argument
  if (arg.tag) return buildTaggedTemplate(ctx, arg.tag)
  // expression, subquery or fragment argument
  return ctx.build(arg.arg)
}

const unary = op => ({
  minArgs: 1,
  maxArgs: 1,
  build: (ctx, args) => `${op} ${build(ctx, args[0])}`
})

const unaryFunction = op => ({
  minArgs: 1,
  maxArgs: 1,
  build: (ctx, args) => `${op}(${build(ctx, args[0])})`
})

const binary = op => ({
  minArgs: 2,
  maxArgs: 2,
  build: (ctx, args) => `(${build(ctx, args[0])} ${op} ${build(ctx, args[1])})`
})

const ternary = (op1, op2) => ({
  minArgs: 3,
  maxArgs: 3,
  build: (ctx, args) =>
    `(${build(ctx, args[0])} ${op1} ${build(ctx, args[1])} ${op2} ${build(
      ctx,
      args[2]
    )})`
})

const nary = op => ({
  minArgs: 1,
  maxArgs: Number.MAX_SAFE_INTEGER,
  build: (ctx, args) => {
    if (args.length === 1) return build(ctx, args[0])
    let txt = '('
    for (let i = 0; i < args.length; ++i) {
      if (i !== 0) txt += ` ${op} `
      txt += build(ctx, args[i])
    }
    return txt + ')'
  }
})

module.exports = {
  build,
  unaryFunction,
  unary,
  binary,
  ternary,
  nary
}
