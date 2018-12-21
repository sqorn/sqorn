const { sq, query } = require('../tape')

describe('distinct', () => {
  describe('distinct', () => {
    query({
      name: '.distinct',
      query: sq.distinct.from`book`,
      text: 'select distinct * from book'
    })
    query({
      name: '.distinct.distinct',
      query: sq.distinct.distinct.from`book`,
      text: 'select distinct * from book'
    })
    query({
      name: '.from.distinct',
      query: sq.from`book`.distinct,
      text: 'select distinct * from book'
    })
    query({
      name: '.return.distinct',
      query: sq.return('title').distinct.from`book`,
      text: 'select distinct title from book'
    })
    query({
      name: '.distinct.return',
      query: sq.distinct.return('title').from`book`,
      text: 'select distinct title from book'
    })
  })
  describe('distinct on template string', () => {
    query({
      name: '.distinctOn``',
      query: sq.distinctOn`title`.from`book`,
      text: 'select distinct on (title) * from book'
    })
    query({
      name: '.distinctOn``.distinctOn``',
      query: sq.distinctOn`title`.distinctOn`genre`.from`book`,
      text: 'select distinct on (title, genre) * from book'
    })
    query({
      name: '.distinctOn``.distinctOn``.distinctOn``',
      query: sq.distinctOn`title`.distinctOn`genre`.distinctOn`year`.from`book`,
      text: 'select distinct on (title, genre, year) * from book'
    })
  })
  describe('distinct on args', () => {
    query({
      name: '.distinctOn()',
      query: sq.distinctOn('title').from`book`,
      text: 'select distinct on (title) * from book'
    })
    query({
      name: '.distinctOn subquery',
      query: sq.distinctOn(sq.txt`title`).from`book`,
      text: 'select distinct on (title) * from book'
    })
    query({
      name: '.distinctOn().distinctOn()',
      query: sq.distinctOn('title').distinctOn('genre').from`book`,
      text: 'select distinct on (title, genre) * from book'
    })
    query({
      name: '.distinctOn().distinctOn().distinctOn()',
      query: sq
        .distinctOn('title')
        .distinctOn('genre')
        .distinctOn('year').from`book`,
      text: 'select distinct on (title, genre, year) * from book'
    })
    query({
      name: '.distinctOn multiple args',
      query: sq.distinctOn('title', 'genre', 'year').from`book`,
      text: 'select distinct on (title, genre, year) * from book'
    })
    query({
      name: '.distinctOn.distinct',
      query: sq.distinctOn('title').distinct.from`book`,
      text: 'select distinct * from book'
    })
    query({
      name: '.distinct.distinctOn',
      query: sq.distinct.distinctOn('title').from`book`,
      text: 'select distinct on (title) * from book'
    })
  })
})
