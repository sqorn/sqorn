const {
  methods,
  newContextCreator,
  queries,
  query,
  clauses,
  util
} = require('sqorn-sql')
const {
  wth,
  from,
  where,
  group,
  having,
  setop,
  order,
  limit,
  offset,
  returning,
  set
} = clauses
const { fromItems, expressions } = util

const newContext = newContextCreator({
  parameter: (ctx, arg) =>
    arg === undefined ? 'default' : `$${ctx.arg.push(arg)}`
})

const postgresMethods = {
  distinct: {
    getter: true,
    updateContext: ctx => {
      ctx.target = ctx.distinct = []
    }
  },
  on: {
    updateContext: (ctx, args) => {
      if (ctx.target === ctx.distinct) {
        // distinct.on()
        ctx.distinct.push(args)
      } else {
        // join.on()
        const { join } = ctx
        if (join.on) {
          join.on.push({ type: 'and', args })
        } else {
          ctx.target = join.on = [{ type: 'and', args }]
        }
      }
    }
  }
}

// SELECT supports .distinct.on(...expressions)
const select = ctx => {
  const { distinct } = ctx
  let txt = 'select'
  if (distinct) {
    txt += ' distinct'
    if (distinct.length) txt += ` on (${expressions(ctx, ctx.distinct)})`
  }
  return `${txt} ${expressions(ctx, ctx.ret) || '*'}`
}
// DELETE: first .from call is used in the DELETE clause
// subsequent .from calls are used in the USING clause
const del = ctx => {
  const txt = fromItems(ctx, ctx.frm, 0, 1)
  return txt && `delete from ${txt}`
}
const using = ctx => {
  const txt = fromItems(ctx, ctx.frm, 1)
  return txt && `using ${txt}`
}
// UPDATE: first .from call is used in the UPDATE clause
// subsequent .from calls are used in the FROM clause
const update = ctx => {
  const txt = fromItems(ctx, ctx.frm, 0, 1)
  return txt && `update ${txt}`
}
const updateFrom = ctx => {
  const txt = fromItems(ctx, ctx.frm, 1)
  return txt && `from ${txt}`
}

module.exports = {
  methods: { ...methods, ...postgresMethods },
  newContext,
  queries: {
    ...queries,
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
    delete: query(wth, del, using, where, returning),
    update: query(wth, update, set, updateFrom, where, returning)
  },
  properties: {
    rollup: {
      value: (...args) => {
        return {
          type: 'rollup',
          args
        }
      }
    },
    cube: {
      value: (...args) => {
        return {
          type: 'cube',
          args
        }
      }
    },
    groupingSets: {
      value: (...args) => {
        return {
          type: 'grouping sets',
          args
        }
      }
    }
  }
}
