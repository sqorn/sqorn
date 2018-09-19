const {
  isTaggedTemplate,
  buildTaggedTemplate,
  snakeCase
} = require('./helpers')

const expressions = (ctx, calls) => {
  let txt = ''
  for (let i = 0; i < calls.length; ++i) {
    if (i !== 0) txt += ', '
    txt += build(ctx, calls[i])
  }
  return txt
}

const build = (ctx, args) => {
  if (args === undefined) {
    // no from clause
    return ''
  } else if (typeof args[0] === 'string') {
    // string table names
    return args.join(', ')
  } else if (isTaggedTemplate(args)) {
    // template string tables
    return buildTaggedTemplate(ctx, args)
  } else {
    return objectTables(ctx, args[0])
    // object tables
  }
}

const objectTables = (ctx, object) => {
  let txt = ''
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    const key = keys[i]
    txt += table(ctx, key, object[key])
  }
  return txt
}

const table = (ctx, alias, source) => {
  if (typeof source === 'string') {
    return `${source} as ${snakeCase(alias)}`
  } else if (Array.isArray(source)) {
    return tableFromArray(ctx, alias, source)
  } else if (typeof source.bld === 'function') {
    return `(${source.bld(ctx).text}) as ${snakeCase(alias)}`
  }
  return `${ctx.parameter(ctx, source)} as ${snakeCase(alias)}`
}

const tableFromArray = (ctx, alias, source) => {
  // get unique columns
  const keys = uniqueKeysFromObjectArray(source)
  let columns = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) columns += ', '
    columns += snakeCase(keys[i])
  }
  // get values
  let values = ''
  for (let i = 0; i < source.length; ++i) {
    if (i !== 0) values += ', '
    values += '('
    const object = source[i]
    for (let j = 0; j < keys.length; ++j) {
      if (j !== 0) values += ', '
      values += ctx.parameter(ctx, object[keys[j]])
    }
    values += ')'
  }
  return `(values ${values}) as ${snakeCase(alias)}(${columns})`
}

const uniqueKeysFromObjectArray = array => {
  const keys = {}
  for (const object of array) {
    for (const key in object) {
      keys[key] = true
    }
  }
  return Object.keys(keys)
}

module.exports = { expressions }
