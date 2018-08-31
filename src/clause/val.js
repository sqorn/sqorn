const snakeCase = require('lodash.snakecase')
const { isTaggedTemplate, buildTaggedTemplate, parameter } = require('./util')

module.exports = ctx => {
  const { columns, values } = inserts(ctx)
  return '(' + columns + ') values ' + values
}

const inserts = ctx => {
  const [first, ...rest] = ctx.ins
  const firstArg = first[0]
  if (typeof firstArg === 'string') {
    // string column names
    const columns = first.join(', ')
    const values = rest
      .map(args => '(' + columnNamesFromArgList(ctx, args, first.length) + ')')
      .join(', ')
    return { columns, values }
  } else if (isTaggedTemplate(first)) {
    // template string column names
    const columns = buildTaggedTemplate(ctx, first)
    const values = rest
      .map(val => '(' + buildTaggedTemplate(ctx, val) + ')')
      .join(', ')
    return { columns, values }
  } else if (typeof firstArg === 'object') {
    // object inserts
    const columns = columnNamesFromObjects(ctx)
    const values = valueTuplesFromObjects(ctx, columns)
    return { columns: columns.join(', '), values }
  }
}

const columnNamesFromArgList = (ctx, args, numColumns) => {
  let txt = parameter(ctx, args[0])
  for (let i = 1; i < numColumns; ++i) {
    txt += ', ' + parameter(ctx, args[i])
  }
  return txt
}

const columnNamesFromObjects = ctx => {
  const inserts = ctx.ins
  const columns = {}
  for (let i = 0; i < inserts.length; ++i) {
    const insert = inserts[i]
    for (let j = 0; j < insert.length; ++j) {
      const arg = insert[j]
      insert[j] = normalized = {}
      for (const key in arg) {
        const normalizedKey = snakeCase(key)
        columns[normalizedKey] = true
        normalized[normalizedKey] = arg[key]
      }
    }
  }
  return Object.keys(columns)
}

const valueTuplesFromObjects = (ctx, columns) => {
  const inserts = ctx.ins
  let txt = ''
  for (let i = 0; i < inserts.length; ++i) {
    const args = inserts[i]
    if (i > 0) txt += ', '
    for (let j = 0; j < args.length; ++j) {
      if (j > 0) txt += ', '
      const arg = args[j]
      txt += '(' + parameter(ctx, arg[columns[0]])
      for (let k = 1; k < columns.length; ++k) {
        txt += ', ' + parameter(ctx, arg[columns[k]])
      }
      txt += ')'
    }
  }
  return txt
}
