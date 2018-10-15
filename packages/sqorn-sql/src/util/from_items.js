const { isTaggedTemplate, buildTaggedTemplate } = require('./helpers')
const { conditions } = require('./conditions')
const { uniqueKeys, columns, values } = require('./values_array')

const fromItems = (ctx, froms, start = 0, end = froms.length) => {
  if (end > froms.length) end = froms.length
  let txt = ''
  for (let i = start; i < end; ++i) {
    const from = froms[i]
    const isJoin = from.join
    if (i !== start) txt += isJoin ? join(from) : ', '
    txt += fromItem(ctx, from.args)
    if (isJoin) txt += joinConditions(ctx, from)
  }
  return txt
}

const join = from =>
  `${from.on || from.using ? '' : ' natural'} ${joins[from.join]} `

const joins = {
  inner: 'join',
  left: 'left join',
  right: 'right join',
  full: 'full join',
  cross: 'cross join'
}

const joinConditions = (ctx, from) =>
  (from.on && ` on ${conditions(ctx, from.on)}`) ||
  (from.using && ` using (${using(ctx, from.using)})`) ||
  ''

const using = (ctx, using) => {
  let txt = ''
  for (let i = 0; i < using.length; ++i) {
    const args = using[i]
    if (i !== 0) txt += ', '
    if (typeof args[0] === 'string') {
      txt += args.join(', ')
    } else {
      txt += buildTaggedTemplate(ctx, args)
    }
  }
  return txt
}

const fromItem = (ctx, args) =>
  isTaggedTemplate(args) ? buildTaggedTemplate(ctx, args) : fromArgs(ctx, args)

const fromArgs = (ctx, args) => {
  let txt = ''
  for (let i = 0; i < args.length; ++i) {
    if (i !== 0) txt += ', '
    txt += fromArg(ctx, args[i])
  }
  return txt
}

const fromArg = (ctx, arg) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'object') return objectTables(ctx, arg)
  if (typeof arg === 'function') return arg._build(ctx).text
  throw Error('Invalid .from argument')
}

const objectTables = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += buildTable(ctx, key, object[key])
  }
  return txt
}

const buildTable = (ctx, alias, source) => {
  if (typeof source === 'string') return `${source} as ${ctx.mapKey(alias)}`
  if (typeof source === 'function') {
    const query = source._build(ctx)
    const table = query.type === 'select' ? `(${query.text})` : query.text
    return `${table} as ${ctx.mapKey(alias)}`
  }
  if (Array.isArray(source)) {
    const keys = uniqueKeys(source)
    const alias_ = `${ctx.mapKey(alias)}(${columns(ctx, keys)})`
    const table = values(ctx, source, keys)
    return `${table} as ${alias_}`
  }
  return `${ctx.parameter(ctx, source)} as ${ctx.mapKey(alias)}`
}

module.exports = { fromItems }
