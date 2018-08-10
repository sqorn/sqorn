const { build } = require('./util')

module.exports = ctx => {
  if (ctx.ret) {
    const { txt, arg } = build(ctx, ctx.ret)
    return {
      txt: `select ${txt}`,
      arg
    }
  }
  return {
    txt: `select *`,
    arg: []
  }
}
