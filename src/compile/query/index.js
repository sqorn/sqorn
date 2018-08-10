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
const col = require('./clause/col')
const val = require('./clause/val')
const upd = require('./clause/upd')
const set = require('./clause/set')
const sql = require('./clause/sql')
const raw = require('./clause/raw')

const query = (...clauses) => ctx => {
  const txt = []
  const arg = []
  clauses.forEach(clause => {
    const compiled = clause(ctx)
    if (compiled) {
      txt.push(compiled.txt)
      arg.push(...compiled.arg)
    }
  })
  return { txt: txt.join(' '), arg }
}

module.exports = {
  select: query(wth, sel, frm, whr, grp, hav, ord, lim, off),
  delete: query(wth, del, frm, whr, ret),
  insert: query(wth, ins, col, val, ret),
  update: query(upd, set, whr, ret),
  sql: query(sql),
  raw: query(raw)
}
