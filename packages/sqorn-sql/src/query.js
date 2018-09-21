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
  sql,
  raw
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
  return { text, args: ctx.arg }
}

const queries = {
  sql: query(sql),
  raw: query(raw),
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
