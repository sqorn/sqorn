const isTaggedTemplate = args => {
  // the first argument of a tagged template literal is an array
  // of strings with a property raw that is an array of strings
  const [strings] = args
  return Array.isArray(strings) && strings.raw
}

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
    } else if (typeof arg === 'function') {
      // sql builder arg
      txt += prevString + ctx.build(arg)
    } else {
      // parameterized arg
      txt += prevString + ctx.parameter(arg)
    }
  }
  return txt + strings[i]
}

module.exports = {
  isTaggedTemplate,
  buildTaggedTemplate
}
