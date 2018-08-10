const { build } = require('./util')

module.exports = ctx => {
  if (ctx.val.length == 0) return
  const txt = []
  const arg = []
  ctx.val.forEach(val => {
    const tuple = build(ctx, val)
    txt.push(`(${tuple.txt})`)
    arg.push(...tuple.arg)
  })
  return {
    txt: `values ${txt.join(', ')}`,
    arg
  }
}
