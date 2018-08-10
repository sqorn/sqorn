module.exports = ctx => buildRawTemplate(ctx.raw)

const buildRawTemplate = ([strings, ...args]) => {
  let txt = strings[0]
  for (let i = 0; i < args.length; i++) {
    txt += args[i] + strings[i + 1]
  }
  return { txt, arg: [] }
}
