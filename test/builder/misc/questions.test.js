const { sq, query } = require('../tape')

describe('tutorial', () => {
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
    const q = sq.from({ t: 'trad.bcas' }).from({ v: bcas })
      .set`quantity = v.quantity::integer`.where({
      't.storeId': storeId,
      't.scheduleId': scheduleId,
      join: sq.l`t.product_code = v.code`
    }).return`*`
    query({
      name: 'solution',
      query: q,
      text:
        'update trad.bcas as t set quantity = v.quantity::integer from (values ($1, $2), ($3, $4), ($5, $6)) as v(quantity, code) where (t.store_id = $7 and t.schedule_id = $8 and t.product_code = v.code) returning *',
      args: [1, '2310', 2, '2730', 3, '3511', 12, 23]
    })
  })
})
