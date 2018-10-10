const { snakeCase } = require('./helpers')

// gets unique keys in object array
const uniqueKeys = array => {
  const keys = {}
  for (const object of array) {
    for (const key in object) {
      keys[key] = true
    }
  }
  return Object.keys(keys)
}

// gets column string from unique keys of object array
const columns = keys => {
  let txt = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    txt += snakeCase(keys[i])
  }
  return txt
}

// gets values string of object array
const values = (ctx, source, keys) => {
  let txt = '(values '
  for (let i = 0; i < source.length; ++i) {
    if (i !== 0) txt += ', '
    txt += '('
    const object = source[i]
    for (let j = 0; j < keys.length; ++j) {
      if (j !== 0) txt += ', '
      txt += ctx.parameter(ctx, object[keys[j]])
    }
    txt += ')'
  }
  return txt + ')'
}

module.exports = {
  uniqueKeys,
  columns,
  values
}
