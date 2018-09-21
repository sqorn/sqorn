const { sq, query } = require('../tape')

describe('Set Operators', () => {
  describe('all', () => {
    const A = sq.from`a`
    const B = sq.from`b`
    const C = sq.from`c`
    query({
      name: 'union',
      query: A.union(B),
      text: 'select * from a union (select * from b)'
    })
    query({
      name: 'intersect',
      query: A.intersect(B),
      text: 'select * from a intersect (select * from b)'
    })
    query({
      name: 'except',
      query: A.except(B),
      text: 'select * from a except (select * from b)'
    })
    query({
      name: 'union all',
      query: A.union.all(B),
      text: 'select * from a union all (select * from b)'
    })
    query({
      name: 'intersect all',
      query: A.intersect.all(B),
      text: 'select * from a intersect all (select * from b)'
    })
    query({
      name: 'except all',
      query: A.except.all(B),
      text: 'select * from a except all (select * from b)'
    })
    query({
      name: 'two args',
      query: A.except.all(B, C),
      text:
        'select * from a except all (select * from b) except all (select * from c)'
    })
    query({
      name: 'three args',
      query: A.union(B, C, A),
      text:
        'select * from a union (select * from b) union (select * from c) union (select * from a)'
    })
    query({
      name: 'chained',
      query: A.union(B).except.all(C),
      text:
        'select * from a union (select * from b) except all (select * from c)'
    })
    query({
      name: 'nested',
      query: A.union(C.intersect(B)),
      text:
        'select * from a union (select * from c intersect (select * from b))'
    })
    query({
      name: 'complex',
      query: A.union.all(B).except(C.intersect.all(B)),
      text:
        'select * from a union all (select * from b) except (select * from c intersect all (select * from b))'
    })
    query({
      name: 'complex 2',
      query: A.union.all(B, C).except(A, B),
      text:
        'select * from a union all (select * from b) union all (select * from c) except (select * from a) except (select * from b)'
    })
  })
})
