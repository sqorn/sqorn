/** Initial ctx value */
const newContextCreator = ({ parameter }) => ({ arg = [] } = {}) => ({
  type: 'select',
  express: 'from',
  separator: ' ',
  sql: [],
  frm: [],
  whr: [],
  ret: [],
  ins: [],
  set: [],
  arg,
  parameter
})

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
      ctx.whr.push(args)
    }
  },
  {
    name: 'and',
    updateContext: (ctx, args) => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'or',
    updateContext: (ctx, args) => {
      throw Error('Unimplemented')
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
    updateConext: (ctx, args) => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'left',
    getter: true,
    updateConext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'right',
    getter: true,
    updateConext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'full',
    getter: true,
    updateConext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'cross',
    getter: true,
    updateConext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'inner',
    getter: true,
    updateConext: ctx => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'on',
    updateContext: (ctx, args) => {
      throw Error('Unimplemented')
    }
  },
  {
    name: 'using',
    updateContext: (ctx, args) => {
      throw Error('Unimplemented')
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
        ctx.whr.push(args)
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
