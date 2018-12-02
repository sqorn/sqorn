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
  update: query(wth, update, set, where, returning),
  delete: query(wth, del, where, returning),
  insert: query(wth, insert, returning),
  manual: sqlQuery,
  arg: sqlQuery
}

module.exports = { query, queries }
