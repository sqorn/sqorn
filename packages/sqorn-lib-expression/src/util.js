const { buildTaggedTemplate } = require('@sqorn/lib-util')

const build = (ctx, arg) => {
  if (arg.exp) return `(${arg.exp})`
  if (arg.tag) return buildTaggedTemplate(ctx, arg.tag)
  return ctx.build(arg.arg)
}

const unary = op => ({
  minArgs: 1,
  maxArgs: 1,
  build: (ctx, args) => `${op} ${build(ctx, args[0])}`
})

const binary = op => ({
  minArgs: 2,
  maxArgs: 2,
  build: (ctx, args) => `${build(ctx, args[0])} ${op} ${build(ctx, args[1])}`
})

const ternary = (op1, op2) => ({
  minArgs: 3,
  maxArgs: 3,
  build: (ctx, args) =>
    `${build(ctx, args[0])} ${op1} ${build(ctx, args[1])} ${op2} ${build(
      ctx,
      args[2]
    )}`
})

const nary = op => ({
  minArgs: 1,
  maxArgs: Number.MAX_SAFE_INTEGER,
  build: (ctx, args) => {
    let txt = ''
    for (let i = 0; i < args.length; ++i) {
      if (i !== 0) txt += ` ${op} `
      txt += build(ctx, args[i])
    }
    return txt
  }
})

module.exports = {
  build,
  unary,
  binary,
  ternary,
  nary
}
