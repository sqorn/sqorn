/** Initial ctx value */
const newContextCreator = ({ parameter }) => ({ arg = [] } = {}) => {
  const whr = []
  return {
    // query type: 'sql' | 'select' | 'delete' | 'insert' | 'update'
    type: 'select',
    // express syntax status: 'from' | 'where' | 'return'
    express: 'from',
    // associates calls to .and and .or with calls to .where, .on, or .having
    target: whr,
    // next join target
    nextJoin: { type: 'join', join: 'inner' },
    // current join target, set to ctx.nextJoin on call to .join
    join: undefined,
    // string used to join clauses
    separator: ' ',
    // clause data, e.g. sq.from() modifies ctx.frm
    sql: [],
    frm: [],
    whr,
    ret: [],
    ins: [],
    set: [],
    // parameterized query arguments, initialized to [] but subqueries
    // inherit parent query's arg
    arg,
    // function that parameterizes an argument by adding it to ctx.arg then
    // returning the result text, e.g. '$1', '$2', ..., or '?' for mysql
    parameter
  }
}

/** Query building methods */
const methods = [
  {
    name: 'l',
    updateContext: (ctx, args) => {
      ctx.type = 'sql'
      ctx.sql.push({ args, raw: false })
    }
  },
  {
    name: 'raw',
    updateContext: (ctx, args) => {
      ctx.type = 'sql'
      ctx.sql.push({ args, raw: true })
    }
  },
  {
    name: 'link',
    updateContext: (ctx, args) => {
      ctx.separator = args[0]
    }
  },
  {
    name: 'with',
    updateContext: (ctx, args) => {
      ctx.with.push(args)
    }
  },
  {
    name: 'recursive',
    getter: true,
    updateContext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'from',
    updateContext: (ctx, args) => {
      ctx.frm.push({ type: 'from', args })
    }
  },
  {
    name: 'where',
    updateContext: (ctx, args) => {
      ctx.whr.push({ type: 'and', args })
      ctx.target = ctx.whr
    }
  },
  {
    name: 'and',
    updateContext: (ctx, args) => {
      ctx.target.push({ type: 'and', args })
    }
  },
  {
    name: 'or',
    updateContext: (ctx, args) => {
      ctx.target.push({ type: 'or', args })
    }
  },
  {
    name: 'wrap',
    updateContext: (ctx, args) => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'return',
    updateContext: (ctx, args) => {
      ctx.ret.push(args)
    }
  },
  {
    name: 'group',
    updateContext: (ctx, args) => {
      ctx.grp = args
    }
  },
  {
    name: 'having',
    updateContext: (ctx, args) => {
      ctx.hav = args
    }
  },
  {
    name: 'order',
    updateContext: (ctx, args) => {
      ctx.ord = args
    }
  },
  {
    name: 'limit',
    updateContext: (ctx, args) => {
      ctx.lim = args
    }
  },
  {
    name: 'offset',
    updateContext: (ctx, args) => {
      ctx.off = args
    }
  },
  {
    name: 'join',
    updateContext: (ctx, args) => {
      ctx.join = ctx.nextJoin
      ctx.join.args = args
      ctx.nextJoin = { type: 'join', join: 'inner' }
      ctx.frm.push(ctx.join)
    }
  },
  {
    name: 'left',
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'left'
    }
  },
  {
    name: 'right',
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'right'
    }
  },
  {
    name: 'full',
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'full'
    }
  },
  {
    name: 'cross',
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'cross'
    }
  },
  {
    name: 'inner',
    getter: true,
    updateContext: ctx => {
      ctx.nextJoin.join = 'inner'
    }
  },
  {
    name: 'on',
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.on) {
        join.on.push({ type: 'and', args })
      } else {
        ctx.target = join.on = [{ type: 'and', args }]
      }
    }
  },
  {
    name: 'using',
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.using) {
        join.using.push(args)
      } else {
        join.using = [args]
      }
    }
  },
  {
    name: 'delete',
    getter: true,
    updateContext: ctx => {
      ctx.type = 'delete'
    }
  },
  {
    name: 'insert',
    updateContext: (ctx, args) => {
      ctx.type = 'insert'
      ctx.ins.push(args)
    }
  },
  {
    name: 'value',
    updateContext: (ctx, args) => {
      ctx.type = 'insert'
      ctx.ins.push(args)
    }
  },
  {
    name: 'set',
    updateContext: (ctx, args) => {
      ctx.type = 'update'
      ctx.set.push(args)
    }
  },
  {
    name: 'express',
    updateContext: (ctx, args) => {
      if (ctx.express === 'from') {
        ctx.frm.push({ type: 'from', args })
        ctx.express = 'where'
      } else if (ctx.express === 'where') {
        ctx.whr.push({ type: 'and', args })
        ctx.express = 'return'
      } else if (ctx.express === 'return') {
        ctx.ret.push(args)
        ctx.express = 'done'
      }
    }
  }
]

module.exports = {
  newContextCreator,
  methods
}
