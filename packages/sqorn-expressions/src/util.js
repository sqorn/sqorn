const unary = (method, op = method) => ({
  method,
  args: 1,
  build: (ctx, args) => `${op} ${ctx.build(args[0])}`
})

const binary = (method, op = method) => ({
  method,
  args: 2,
  build: (ctx, args) => `${ctx.build(args[0])} ${op} ${ctx.build(args[1])}`
})

const ternary = (method, op1, op2) => ({
  method,
  args: 3,
  build: (ctx, args) =>
    `${build(args[0])} ${op1} ${ctx.build(args[1])} ${op2} ${ctx.build(
      args[2]
    )}`
})

const nary = (method, op = method) => ({
  method,
  args: [1],
  build: (ctx, args) => {
    let txt = ''
    for (let i = 0; i < args.length; ++i) {
      if (i !== 0) txt += op
      txt += ctx.build(args[i])
    }
    return txt
  }
})

module.exports = {
  unary,
  binary,
  ternary,
  nary
}
