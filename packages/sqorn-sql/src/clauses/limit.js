const { limitOffset } = require('../util')

module.exports = ctx => ctx.limit && `limit ${limitOffset(ctx, ctx.limit)}`
