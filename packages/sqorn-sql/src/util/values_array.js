module.exports = (ctx, array) => {
  const keys = uniqueKeys(array)
  return {
    columns: columns(ctx, keys),
    values: values(ctx, array, keys)
  }
}

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
const columns = (ctx, keys) => {
  let txt = ''
  for (let i = 0; i < keys.length; ++i) {
    if (i !== 0) txt += ', '
    txt += ctx.mapKey(keys[i])
  }
  return txt
}

// gets values string of object array
const values = (ctx, source, keys) => {
  let txt = 'values '
  for (let i = 0; i < source.length; ++i) {
    if (i !== 0) txt += ', '
    txt += '('
    const object = source[i]
    for (let j = 0; j < keys.length; ++j) {
      if (j !== 0) txt += ', '
      txt += value(ctx, object[keys[j]])
    }
    txt += ')'
  }
  return txt
}

const value = (ctx, arg) => {
  if (typeof arg === 'function') {
    const subquery = arg._build(ctx)
    return subquery.type === 'manual' ? subquery.text : `(${subquery.text})`
  }
  return ctx.parameter(ctx, arg)
}
