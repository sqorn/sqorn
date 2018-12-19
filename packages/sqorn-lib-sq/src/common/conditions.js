const {
  isTaggedTemplate,
  buildTaggedTemplate,
  isObject,
  mapJoin,
  objectMapJoin
} = require('@sqorn/lib-util')

const buildCall = callbackfn => (ctx, args) =>
  isTaggedTemplate(args)
    ? `(${buildTaggedTemplate(ctx, args)})`
    : callbackfn(ctx, args)

const buildArg = (ctx, arg) =>
  isObject(arg) ? buildObject(ctx, arg) : ctx.build(arg)

const buildProperty = (ctx, key, value) =>
  `(${ctx.mapKey(key)} = ${ctx.build(value)})`

const buildObject = objectMapJoin(buildProperty, ' and ')
module.exports = mapJoin(buildCall(mapJoin(buildArg, ' and ')), ' and ')
