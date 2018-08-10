const { sq, query } = require('../tape')

describe('ins', () => {
  describe('template string', () => {
    query({
      name: '1 column',
      qry: sq.ins`first_name`,
      txt: '(first_name)'
    })
    query({
      name: '2 columns',
      qry: sq.ins`first_name, last_name`,
      txt: '(first_name, last_name)'
    })
  })
  describe('template string args', () => {
    query({
      name: '1 raw arg',
      qry: sq.ins`$${'first_name'}`,
      txt: '(first_name)'
    })
    query({
      name: '2 raw args',
      qry: sq.ins`$${'first_name'}, $${'last_name'}`,
      txt: '(first_name, last_name)'
    })
  })
})
