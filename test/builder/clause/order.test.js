const { sq, query } = require('../tape')

describe('order', () => {
  query({
    name: 'simple',
    query: sq.from`book`.order`title`,
    text: 'select * from book order by title',
    args: []
  })
  query({
    name: 'two',
    query: sq.from`book`.order`title`.order`year, author`,
    text: 'select * from book order by title, year, author',
    args: []
  })
  query({
    name: 'multiple',
    query: sq.from`book`.order`title`.order`year`.order`author`,
    text: 'select * from book order by title, year, author',
    args: []
  })
  query({
    name: 'string',
    query: sq.from('book').order('title'),
    text: 'select * from book order by title',
    args: []
  })
  query({
    name: 'two strings',
    query: sq.from('book').order('title', 'year'),
    text: 'select * from book order by title, year',
    args: []
  })
  query({
    name: 'string args',
    query: sq.from('book').order('title', 'year', 'author'),
    text: 'select * from book order by title, year, author',
    args: []
  })
  query({
    name: 'subquery args',
    query: sq
      .from('book')
      .order(sq.l`title asc`, sq.l`year desc`, sq.l`author`),
    text: 'select * from book order by title asc, year desc, author',
    args: []
  })
  query({
    name: 'object arg - by',
    query: sq.from`book`.order({ by: 'title' }, { by: 'year' }),
    text: 'select * from book order by title, year',
    args: []
  })
  query({
    name: 'object arg - sort asc',
    query: sq.from`book`.order({ by: 'title', sort: 'asc' }),
    text: 'select * from book order by title asc',
    args: []
  })
  query({
    name: 'object arg - sort desc',
    query: sq.from`book`.order({ by: 'title', sort: 'desc' }),
    text: 'select * from book order by title desc',
    args: []
  })
  query({
    name: 'object arg - sort using',
    query: sq.from`book`.order({ by: 'title', sort: '~<~' }),
    text: 'select * from book order by title using ~<~',
    args: []
  })
  query({
    name: 'object arg - nulls first',
    query: sq.from`book`.order({ by: 'title', nulls: 'first' }),
    text: 'select * from book order by title nulls first',
    args: []
  })
  query({
    name: 'object arg - nulls first',
    query: sq.from`book`.order({ by: 'title', nulls: 'last' }),
    text: 'select * from book order by title nulls last',
    args: []
  })
  query({
    name: 'object arg - sort desc nulls last',
    query: sq.from`book`.order({ by: 'title', sort: 'desc', nulls: 'last' }),
    text: 'select * from book order by title desc nulls last',
    args: []
  })
  query({
    name: 'object arg - sort asc nulls first',
    query: sq.from`book`.order({ by: 'title', sort: 'asc', nulls: 'first' }),
    text: 'select * from book order by title asc nulls first',
    args: []
  })
  query({
    name: 'object arg - sort using nulls first',
    query: sq.from`book`.order({ by: 'title', sort: '<', nulls: 'first' }),
    text: 'select * from book order by title using < nulls first',
    args: []
  })
  query({
    name: 'object arg - sort using nulls last',
    query: sq.from`book`.order({ by: 'title', sort: '<', nulls: 'last' }),
    text: 'select * from book order by title using < nulls last',
    args: []
  })
  query({
    name: 'multiple complex object args',
    query: sq.from`book`.order(
      { by: 'title', sort: 'asc' },
      { by: 'year', sort: '<', nulls: 'last' },
      { by: 'author', nulls: 'last' }
    ),
    text:
      'select * from book order by title asc, year using < nulls last, author nulls last',
    args: []
  })
  query({
    name: 'multiple args - object, string, subquery',
    query: sq.from`book`.order(
      { by: 'title', sort: 'asc' },
      'year using < nulls last',
      sq.l`author nulls last`
    ),
    text:
      'select * from book order by title asc, year using < nulls last, author nulls last',
    args: []
  })
})
