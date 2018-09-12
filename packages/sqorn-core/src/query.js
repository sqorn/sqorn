const wth = require('./clause/with')
const select = require('./clause/select')
const from = require('./clause/from')
const where = require('./clause/where')
const groupby = require('./clause/groupby')
const having = require('./clause/having')
const orderby = require('./clause/orderby')
const limit = require('./clause/limit')
const offset = require('./clause/offset')
const del = require('./clause/delete')
const returning = require('./clause/returning')
const insert = require('./clause/insert')
const values = require('./clause/values')
const update = require('./clause/update')
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
  return { text: txt.slice(0, -1), args: ctx.arg }
}

module.exports = {
  sql: query(sql),
  select: query(wth, select, from, where, groupby, having, orderby, limit, offset),
  delete: query(wth, del, where, returning),
  insert: query(wth, insert, values, returning),
  update: query(wth, update, set, where, returning)
}
