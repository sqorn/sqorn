const limitOffset = require('../common/limit_offset')

module.exports = ctx => ctx.limit && `limit ${limitOffset(ctx, ctx.limit)}`
