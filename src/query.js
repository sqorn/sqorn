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

const query = (...clauses) => ctx => {
  let txt = ''
  for (const clause of clauses) {
    const str = clause && clause(ctx)
    if (str) {
      txt += str + ' '
    }
  }
  return { txt: txt.slice(0, -1), arg: ctx.arg }
}

module.exports = {
  sql: query(sql),
  select: query(wth, sel, frm, whr, grp, hav, ord, lim, off),
  delete: query(wth, del, whr, ret),
  insert: query(wth, ins, val, ret),
  update: query(wth, upd, set, whr, ret)
}
