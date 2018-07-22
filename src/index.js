const sql = (strings, args) => {
  let result = strings[0]
  for (let i = 0; i < args.length; i++) {
    result += args[i] + strings[i + 1]
  }
  return result
}

const raw = (strings, args) => {
  let result = strings[0]
  for (let i = 0; i < args.length; i++) {
    result += args[i] + strings[i + 1]
  }
  return result
}

const ctxExample = {
  type: 'select',
  wth: [],
  frm: { s: [], a: [] },
  whr: { s, a },
  ret: { s, a }
}

const buildClauseSelect = ret => {}

const buildClauseFrom = frm => {}

const buildClauseWhere = whr => {}

const joinClauses = clauses => {
  return clauses.join(' ')
}

const buildQuerySelect = ctx => {
  const select = buildClauseSelect(ctx.ret)
  const from = buildClauseFrom(ctx.frm)
  const where = buildClauseWhere(ctx.whr)
  return joinClauses(select, from, where)
}

const buildQueryDelete = ctx => {}

const buildQueryInsert = ctx => {}

const buildQueryUpdate = ctx => {}

const build = ctx => {
  switch (ctx.type) {
    case 'select':
      return buildQuerySelect(ctx)
    case 'delete':
      return buildQueryDelete(ctx)
    case 'insert':
      return buildQueryInsert(ctx)
    case 'update':
      return buildQueryUpdate(ctx)
    default:
      throw Error(`Unrecognized query of type '${ctx.typ}'`)
  }
}

console.log(sq`person`)
