const { limitOffset } = require('../util')

module.exports = ctx => ctx.offset && `offset ${limitOffset(ctx, ctx.offset)}`
