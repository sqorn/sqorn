const { expressions } = require('../util')

module.exports = ctx => `select ${expressions(ctx, ctx.ret) || '*'}`
