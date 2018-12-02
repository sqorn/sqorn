const { sq, query } = require('../tape')

describe('https://github.com/lusakasa/sqorn/issues/9', () => {
  const bcas = [
    {
      quantity: 1,
      code: '2310'
    },
    {
      quantity: 2,
      code: '2730'
    },
    {
      quantity: 3,
      code: '3511'
    }
  ]
  const storeId = 12
  const scheduleId = 23
  query({
    name: 'solution',
    query: sq.from({ t: 'trad.bcas' }).from({ v: bcas })
      .set`quantity = v.quantity::integer`.where({
      't.storeId': storeId,
      't.scheduleId': scheduleId,
      join: sq.l`t.product_code = v.code`
    }).return`*`,
    text:
      'update trad.bcas as t set quantity = v.quantity::integer from (values ($1, $2), ($3, $4), ($5, $6)) as v(quantity, code) where (t.store_id = $7 and t.schedule_id = $8 and t.product_code = v.code) returning *',
    args: [1, '2310', 2, '2730', 3, '3511', 12, 23]
  })
  query({
    name: 'solution - insert query',
    query: sq.from({ t: 'trad.bcas' }).from({ v: bcas })
      .set`quantity = v.quantity::integer`.where({
      't.storeId': storeId,
      't.scheduleId': scheduleId,
      join: sq.l`t.product_code = v.code`
    }).return`*`,
    text:
      'update trad.bcas as t set quantity = v.quantity::integer from (values ($1, $2), ($3, $4), ($5, $6)) as v(quantity, code) where (t.store_id = $7 and t.schedule_id = $8 and t.product_code = v.code) returning *',
    args: [1, '2310', 2, '2730', 3, '3511', 12, 23]
  })

  const values = sq
    .extend(...bcas.map(b => sq.l`(${b.quantity}, ${b.code})`))
    .link(', ')
  query({
    name: 'solution - manual query',
    query: sq.l`update trad.bcas as t`.l`set quantity = v.quantity::integer`
      .l`from (values ${values}) as v(quantity, code)`
      .l`where (t.store_id = ${storeId} and t.schedule_id = ${scheduleId} and t.product_code = v.code)`
      .l`returning *`,
    text:
      'update trad.bcas as t set quantity = v.quantity::integer from (values ($1, $2), ($3, $4), ($5, $6)) as v(quantity, code) where (t.store_id = $7 and t.schedule_id = $8 and t.product_code = v.code) returning *',
    args: [1, '2310', 2, '2730', 3, '3511', 12, 23]
  })
})

describe('https://github.com/lusakasa/sqorn/issues/46', () => {
  query({
    name: 'distinct on bug 1',
    query: sq.return`t.id`.distinctOn`t.id`.from`test t`.join`foo f`
      .on`f.tid = t.id`,
    text:
      'select distinct on (t.id) t.id from test t join foo f on (f.tid = t.id)'
  })
  query({
    name: 'distinct on bug 2',
    query: sq.return`t.id`.distinctOn`t.id`.from`test t`.join`foo f`
      .on`f.tid = t.id`.and`f.type = 2`,
    text:
      'select distinct on (t.id) t.id from test t join foo f on (f.tid = t.id) and (f.type = 2)'
  })
})
