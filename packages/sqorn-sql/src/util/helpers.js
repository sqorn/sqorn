// first argument of tagged template literal is array with property raw
const isTaggedTemplate = ([strings]) => Array.isArray(strings) && strings.raw

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let i = 0
  let txt = ''
  for (; i < args.length; ++i) {
    const arg = args[i]
    const prevString = strings[i]
    const lastCharIndex = prevString.length - 1
    if (prevString[lastCharIndex] === '$') {
      // raw arg
      txt += prevString.substr(0, lastCharIndex) + args[i]
    } else {
      // parameterized arg
      txt += prevString + ctx.build(arg)
    }
  }
  return txt + strings[i]
}

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
  isTaggedTemplate,
  buildTaggedTemplate,
  buildCall,
  mapJoin,
  mapJoinWrap,
  objectMapJoin
}
