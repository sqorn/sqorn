const { isTaggedTemplate, buildTaggedTemplate } = require('./tagged_template')

const isObject = arg => arg && arg.constructor.prototype === Object.prototype

const buildCall = callbackfn => (ctx, args) =>
  isTaggedTemplate(args)
    ? buildTaggedTemplate(ctx, args)
    : callbackfn(ctx, args)

const mapJoin = (callbackfn, separator = ', ') => (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += separator
    txt += callbackfn(ctx, args[i])
  }
  return txt
}

const mapJoinWrap = (callbackfn, separator = ', ', open = '(', close = ')') => (
  ctx,
  args
) => {
  let txt = open
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += separator
    txt += callbackfn(ctx, args[i])
  }
  return txt + close
}

const objectMapJoin = (callbackfn, separator = ', ') => (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += separator
    const key = keys[i]
    txt += callbackfn(ctx, key, object[key])
  }
  return txt
}

module.exports = {
  isObject,
  buildCall,
  mapJoin,
  mapJoinWrap,
  objectMapJoin
}
