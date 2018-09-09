const { join } = require('./util')

module.exports = ctx => `select ${join(ctx, ctx.ret) || '*'}`
