/** Query building methods */
const methods = {
  sql: {
    updateContext: (ctx, args) => {
      ctx.type = 'manual'
      ctx.userType = 'select'
      ctx.sql.push({ args, raw: false })
    }
  },
  txt: {
    updateContext: (ctx, args) => {
      ctx.type = 'manual'
      ctx.userType = 'fragment'
      ctx.sql.push({ args, raw: false })
    }
  },
  raw: {
    updateContext: (ctx, args) => {
      // ctx.type = ctx.type === 'select' ? 'arg' : 'manual'
      ctx.type = 'manual'
      ctx.sql.push({ args, raw: true })
    }
  },
  link: {
    updateContext: (ctx, args) => {
      ctx.separator = args[0]
    }
  },
  with: {
    updateContext: (ctx, args) => {
      ctx.with.push(args)
    }
  },
  recursive: {
    getter: true,
    updateContext: ctx => {
      ctx.recursive = true
    }
  },
  from: {
    updateContext: (ctx, args) => {
      ctx.frm.push({ args })
    }
  },
  where: {
    updateContext: (ctx, args) => {
      ctx.whr.push({ type: 'and', args })
      ctx.target = ctx.whr
    }
  },
  and: {
    updateContext: (ctx, args) => {
      ctx.target.push({ type: 'and', args })
    }
  },
  or: {
    updateContext: (ctx, args) => {
      ctx.target.push({ type: 'or', args })
    }
  },
  return: {
    updateContext: (ctx, args) => {
      ctx.ret.push(args)
    }
  },
  distinct: {
    getter: true,
    updateContext: ctx => {
      ctx.distinct = []
    }
  },
  groupBy: {
    updateContext: (ctx, args) => {
      ctx.grp.push(args)
    }
  },
  having: {
    updateContext: (ctx, args) => {
      ctx.hav.push({ type: 'and', args })
      ctx.target = ctx.hav
    }
  },
  union: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'union', args })
    }
  },
  unionAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'union all', args })
    }
  },
  intersect: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'intersect', args })
    }
  },
  intersectAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'intersect all', args })
    }
  },
  except: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'except', args })
    }
  },
  exceptAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'except all', args })
    }
  },
  orderBy: {
    updateContext: (ctx, args) => {
      ctx.ord.push(args)
    }
  },
  limit: {
    updateContext: (ctx, args) => {
      ctx.limit = args
    }
  },
  offset: {
    updateContext: (ctx, args) => {
      ctx.offset = args
    }
  },
  join: {
    updateContext: (ctx, args) => {
      ctx.join = ctx.nextJoin
      ctx.join.args = args
      ctx.nextJoin = { join: 'inner' }
      ctx.frm.push(ctx.join)
    }
  },
  left: {
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'left'
    }
  },
  right: {
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'right'
    }
  },
  full: {
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'full'
    }
  },
  cross: {
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'cross'
    }
  },
  inner: {
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'inner'
    }
  },
  on: {
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.on) {
        join.on.push({ type: 'and', args })
      } else {
        ctx.target = join.on = [{ type: 'and', args }]
      }
    }
  },
  using: {
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.using) {
        join.using.push(args)
      } else {
        join.using = [args]
      }
    }
  },
  delete: {
    getter: true,
    updateContext: ctx => {
      ctx.type = 'delete'
    }
  },
  insert: {
    updateContext: (ctx, args) => {
      ctx.type = 'insert'
      ctx.insert = args
    }
  },
  set: {
    updateContext: (ctx, args) => {
      ctx.type = 'update'
      ctx.set.push(args)
    }
  },
  express: {
    updateContext: (ctx, args, count) => {
      if (count.id === 0) {
        count.id++
        ctx.frm.push({ type: 'from', args })
      } else if (count.id === 1) {
        count.id++
        ctx.whr.push({ type: 'and', args })
      } else if (count.id === 2) {
        count.id++
        ctx.ret.push(args)
      } else throw Error('Invalid express call')
    }
  }
}

module.exports = methods
