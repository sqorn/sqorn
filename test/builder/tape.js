const sqorn = require('../../src/index.js')
const sq = sqorn()

const query = ({ name, query, text, args = [] }) =>
  test(name, () => {
    expect(query.query).toEqual({ text, args })
  })

module.exports = { sq, query }
