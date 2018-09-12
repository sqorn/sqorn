const sqorn = require('../../packages/sqorn-pg')
const sq = sqorn()

const query = ({ name, query, text, args = [] }) =>
  test(name, () => {
    expect(query.query).toEqual({ text, args })
  })

module.exports = { sq, query }
