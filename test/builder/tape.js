const sqorn = require('../../packages/sqorn-pg')
const sq = sqorn()

const query = ({ name, query, text, args = [], error }) =>
  test(name, () => {
    if (error) {
      expect(() => query.query).toThrowError()
    } else {
      const res = query.query
      expect({ text: res.text, args: res.args }).toEqual({ text, args })
    }
  })

module.exports = { sq, e: sq.e, query, sqorn }
