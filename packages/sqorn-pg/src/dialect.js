const {
  methods,
  newContextCreator,
  queries,
  query,
  clauses,
  util
} = require('sqorn-sql')
const { wth, where, returning, set } = clauses
const { join } = util

const parameter = (ctx, arg) =>
  arg === undefined ? 'default' : `$${ctx.arg.push(arg)}`

const newContext = newContextCreator({ parameter })

// Postgres specific grammar:

// DELETE: the .from call is used in the DELETE clause
// subsequent .from calls are used in the USING clause
const del = ctx => {
  const txt = join(ctx, ctx.frm.slice(0, 1))
  return txt && `delete from ${txt}`
}
const using = ctx => {
  const txt = join(ctx, ctx.frm.slice(1))
  return txt && `using ${txt}`
}
// UPDATE: the .from call is used in the UPDATE clause
// subsequent .from calls are used in the FROM clause
const update = ctx => {
  const txt = join(ctx, ctx.frm.slice(0, 1))
  return txt && `update ${txt}`
}
const from = ctx => {
  const txt = join(ctx, ctx.frm.slice(1))
  return txt && `from ${txt}`
}

module.exports = {
  methods,
  newContext,
  queries: {
    ...queries,
    delete: query(wth, del, using, where, returning),
    update: query(wth, update, set, from, where, returning)
  }
}
