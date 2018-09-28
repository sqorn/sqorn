const {
  wth,
  select,
  from,
  where,
  group,
  having,
  setop,
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
  let text = ''
  for (const clause of clauses) {
    const str = clause && clause(ctx)
    if (str) {
      if (text) text += ctx.separator
      text += str
    }
  }
  return { text, args: ctx.arg, type: ctx.type }
}

const sqlQuery = query(sql)
const queries = {
  sql: sqlQuery,
  arg: sqlQuery,
  select: query(
    wth,
    select,
    from,
    where,
    group,
    having,
    setop,
    order,
    limit,
    offset
  ),
  delete: query(wth, del, where, returning),
  insert: query(wth, insert, value, returning),
  update: query(wth, update, set, where, returning)
}

module.exports = { query, queries }
