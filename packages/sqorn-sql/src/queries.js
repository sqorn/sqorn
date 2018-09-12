const {
  wth,
  sel,
  frm,
  whr,
  grp,
  hav,
  ord,
  lim,
  off,
  del,
  ret,
  ins,
  val,
  upd,
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
  select: query(wth, sel, frm, whr, grp, hav, ord, lim, off),
  delete: query(wth, del, whr, ret),
  insert: query(wth, ins, val, ret),
  update: query(wth, upd, set, whr, ret)
}
