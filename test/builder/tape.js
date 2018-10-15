const sqorn = require('../../packages/sqorn-pg')
const sq = sqorn()

const query = ({ name, query, text, args = [] }) =>
  test(name, () => {
    const res = query.query
    expect({ text: res.text, args: res.args }).toEqual({ text, args })
  })

module.exports = { sq, query, sqorn }
