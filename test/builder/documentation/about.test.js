const { sq, e, query } = require('../tape')

describe('about', () => {
  query({
    name: 'e.eq',
    query: e.eq,
    error: true
  })
})
