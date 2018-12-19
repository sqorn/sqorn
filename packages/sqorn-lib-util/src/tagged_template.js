// first argument of tagged template literal is array with property raw
const isTaggedTemplate = ([strings]) => Array.isArray(strings) && strings.raw

const buildTaggedTemplate = (ctx, [strings, ...args]) => {
  let txt = strings[0]
  for (let i = 0; i < args.length; ++i) {
    txt += ctx.build(args[i]) + strings[i + 1]
  }
  return txt
}

module.exports = {
  isTaggedTemplate,
  buildTaggedTemplate
}
