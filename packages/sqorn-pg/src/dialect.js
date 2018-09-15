const { methods, newContextCreator, queries } = require('sqorn-sql')

const parameter = (ctx, arg) =>
  arg === undefined ? 'default' : `$${ctx.arg.push(arg)}`

const newContext = newContextCreator({ parameter })

module.exports = {
  methods,
  newContext,
  queries
}
