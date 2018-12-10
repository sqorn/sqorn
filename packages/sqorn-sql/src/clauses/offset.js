const limitOffset = require('../common/limit_offset')

module.exports = ctx => ctx.offset && `offset ${limitOffset(ctx, ctx.offset)}`
