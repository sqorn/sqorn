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
const escape = require('./escape')
const e = require('sqorn-expressions')

const postgresMethods = {
  distinctOn: {
    updateContext: (ctx, args) => {
      if (ctx.distinct) {
        ctx.distinct.push(args)
      } else {
        ctx.distinct = [args]
      }
    }
  }
}

// SELECT supports .distinctOn(...expressions)
const select = ctx => {
  let txt = 'select '
  if (ctx.distinct) {
    txt += 'distinct '
    if (ctx.distinct.length) {
      txt += `on (${expressions(ctx, ctx.distinct)}) `
    }
  }
  txt += expressions(ctx, ctx.ret) || '*'
  return txt
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

function parameter(arg) {
  if (arg === undefined) throw Error('Invalid Query: undefined parameter')
  return `$${this.arg.push(arg)}`
}

module.exports = ({ mapInputKeys }) => ({
  methods: { ...methods, ...postgresMethods },
  newContext: newContextCreator({ parameter, escape, mapInputKeys }),
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
    e: {
      value: e
    },
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
})
