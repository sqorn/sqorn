const wth = require('./clause/wth')
const sel = require('./clause/sel')
const frm = require('./clause/frm')
const whr = require('./clause/whr')
const grp = require('./clause/grp')
const hav = require('./clause/hav')
const ord = require('./clause/ord')
const lim = require('./clause/lim')
const off = require('./clause/off')
const del = require('./clause/del')
const ret = require('./clause/ret')
const ins = require('./clause/ins')
const val = require('./clause/val')
const upd = require('./clause/upd')
const set = require('./clause/set')
const sql = require('./clause/sql')
const raw = require('./clause/raw')

const query = (...clauses) => ctx => {
  const txt = clauses
    .map(clause => clause(ctx))
    .filter(txt => txt)
    .join(' ')
  return { txt, arg: ctx.arg }
}

module.exports = {
  sql: query(sql),
  raw: query(raw),
  select: query(wth, sel, frm, whr, grp, hav, ord, lim, off),
  delete: query(wth, del, whr, ret),
  insert: query(wth, ins, val, ret),
  update: query(upd, set, whr, ret)
}
