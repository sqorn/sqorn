const { queries, context, methods } = require('sqorn-sql')

const parameter = (ctx, arg) =>
  arg === undefined ? 'default' : `$${ctx.arg.push(arg)}`

module.exports = {
  parameter,
  queries,
  context,
  methods
}
