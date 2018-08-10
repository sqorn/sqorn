const { build } = require('./util')

module.exports = ctx => 'select ' + (ctx.ret ? build(ctx, ctx.ret) : '*')
