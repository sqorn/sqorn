const sqorn = require('../../packages/sqorn/src')
const client = require('../../packages/sqorn-pg/src')
const sq = sqorn({ client })

const query = ({ name, query, text, args = [] }) =>
  test(name, () => {
    expect(query.query).toEqual({ text, args })
  })

module.exports = { sq, query }
