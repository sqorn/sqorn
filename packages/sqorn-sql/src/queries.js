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
  sql,
  raw
} = require('./clauses')

const query = (...clauses) => ctx => {
  let text = ''
  let follows = false
  for (const clause of clauses) {
    const str = clause && clause(ctx)
    if (str) {
      if (follows) {
        text += ctx.separator
      } else {
        follows = true
      }
      text += str
    }
  }
  return { text, args: ctx.arg }
}

module.exports = {
  sql: query(sql),
  raw: query(raw),
  select: query(wth, select, from, where, group, having, order, limit, offset),
  delete: query(wth, del, where, returning),
  insert: query(wth, insert, value, returning),
  update: query(wth, update, set, where, returning)
}
