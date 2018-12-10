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

module.exports = {
  isTaggedTemplate,
  buildTaggedTemplate
}
