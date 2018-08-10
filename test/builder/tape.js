const sqorn = require('../../src/index.js')
const sq = sqorn()

const query = ({ name, qry, txt, arg = [] }) =>
  test(name, () => {
    expect(qry.qry).toEqual({ txt, arg })
  })

module.exports = { sq, query }
