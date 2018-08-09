const sqorn = require('../../src/index.js')
const sq = sqorn()

const query = ({ qry, txt, arg = [] }) => expect(qry.qry).toEqual({ txt, arg })

module.exports = { sq, query }
