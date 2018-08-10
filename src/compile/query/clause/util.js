const { isBuilder } = require('../../../constants')

const parameter = ctx => `$${++ctx.parameters}`

const isTaggedTemplate = args =>
  Array.isArray(args) &&
  Array.isArray(args[0]) &&
  typeof args[0][0] === 'string'

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = ''
  const arg = []
  let i = 0
  for (; i < args.length; i++) {
    const argument = args[i]
    if (argument[isBuilder]) {
      // merge subquery argument
      const subqry = argument.bld(ctx)
      ctx.parameters += arg.length
      arg.push(...subqry.arg)
      txt += strings[i] + subqry.txt
    } else {
      const prevString = strings[i]
      if (prevString[prevString.length - 1] === '$') {
        // raw argument
        txt += prevString.substr(0, prevString.length - 1) + args[i]
      } else {
        // parameterize argument
        arg.push(argument)
        txt += strings[i] + parameter(ctx)
      }
    }
  }
  return { txt: (txt + strings[i]).trim(), arg }
}

// TODO: should prob be merged into buildTaggedTemplate
const buildRawTemplate = ([strings, ...args]) => {
  let txt = strings[0]
  for (let i = 0; i < args.length; i++) {
    txt += args[i] + strings[i + 1]
  }
  return { txt, arg: [] }
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
  buildRawTemplate,
  build
}
