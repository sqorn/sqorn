const { isBuilder } = require('../constants')

const parameter = (ctx, val) => {
  ctx.arg.push(val)
  return `$${++ctx.parameters}`
}

const isTaggedTemplate = args =>
  Array.isArray(args[0]) && typeof args[0][0] === 'string'

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let i = 0
  let txt = ''
  for (; i < args.length; i++) {
    const argument = args[i]
    const prevString = strings[i]
    const lastCharIndex = prevString.length - 1
    if (prevString[lastCharIndex] === '$') {
      // raw argument
      txt += prevString.substr(0, lastCharIndex) + args[i]
    } else if (argument[isBuilder]) {
      // sql builder argument
      txt += prevString + argument.bld(ctx).txt
    } else {
      // parameterized argument
      txt += prevString + parameter(ctx, argument)
    }
  }
  txt += strings[i]
  return txt
}

const build = (ctx, params) => {
  if (isTaggedTemplate(params)) {
    return buildTaggedTemplate(ctx, params)
  } else {
    throw Error('Cant build plain function calls yet')
  }
}

module.exports = {
  parameter,
  isTaggedTemplate,
  buildTaggedTemplate,
  build
}
