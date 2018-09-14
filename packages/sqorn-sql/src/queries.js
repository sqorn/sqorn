const {
  wth,
  select,
  from,
  where,
  group,
  having,
  order,
  limit,
  offset,
  del,
  returning,
  insert,
  value,
  update,
  set,
  sql
} = require('./clauses')

const query = (...clauses) => ctx => {
  let txt = ''
  for (const clause of clauses) {
    const str = clause && clause(ctx)
    if (str) {
      txt += str + ' '
    }
  }
  return { text: txt.slice(0, -1), args: ctx.arg }
}

module.exports = {
  sql: query(sql),
  select: query(wth, select, from, where, group, having, order, limit, offset),
  delete: query(wth, del, where, returning),
  insert: query(wth, insert, value, returning),
  update: query(wth, update, set, where, returning)
}
