const { sq, query } = require('../tape')

describe('join', () => {
  describe('join types', () => {
    query({
      name: 'natural join',
      query: sq.from`book`.join`publisher`,
      text: 'select * from book natural join publisher'
    })
    query({
      name: 'natural inner join',
      query: sq.from`book`.inner.join`publisher`,
      text: 'select * from book natural join publisher'
    })
    query({
      name: 'natural left join',
      query: sq.from`book`.left.join`publisher`,
      text: 'select * from book natural left join publisher'
    })
    query({
      name: 'natural right join',
      query: sq.from`book`.right.join`publisher`,
      text: 'select * from book natural right join publisher'
    })
    query({
      name: 'natural full join',
      query: sq.from`book`.full.join`publisher`,
      text: 'select * from book natural full join publisher'
    })
    query({
      name: 'natural cross join',
      query: sq.from`book`.cross.join`publisher`,
      text: 'select * from book natural cross join publisher'
    })
  })
  describe('multiple joins', () => {
    query({
      name: 'two joins',
      query: sq.from`book`.join`author`.join`publisher`,
      text: 'select * from book natural join author natural join publisher'
    })
    query({
      name: 'three joins',
      query: sq.from`a`.join`b`.join`c`.join`d`,
      text: 'select * from a natural join b natural join c natural join d'
    })
    query({
      name: 'multiple mixed join types',
      query: sq.from`a`.left.join`b`.right.join`c`.cross.join`d`,
      text:
        'select * from a natural left join b natural right join c natural cross join d'
    })
    query({
      name: 'repeat join types',
      query: sq.from`a`.left.right.cross.join`b`.cross.full.join`c`.full.inner
        .join`d`,
      text:
        'select * from a natural cross join b natural full join c natural join d'
    })
  })
  describe('join overloads', () => {
    query({
      name: 'two joins',
      query: sq.from({ b: 'book' }).join({ p: 'publisher' }),
      text: 'select * from book as b natural join publisher as p'
    })
    query({
      name: 'two joins',
      query: sq.from('book').join('publisher'),
      text: 'select * from book natural join publisher'
    })
  })
  describe('join on', () => {
    query({
      name: 'on template string',
      query: sq.from`book`.join`author`.on`book.author_id = author.id`,
      text: 'select * from book join author on (book.author_id = author.id)'
    })
    query({
      name: 'on object',
      query: sq.from`book`.join`author`.on({
        join: sq.l`book.author_id = author.id`,
        'book.genre': 'Fantasy'
      }),
      text:
        'select * from book join author on (book.author_id = author.id and book.genre = $1)',
      args: ['Fantasy']
    })
    query({
      name: 'multiple on',
      query: sq.from`book`.join`author`.on`book.author_id = author.id`
        .on`book.genre = ${'Fantasy'}`,
      text:
        'select * from book join author on (book.author_id = author.id) and (book.genre = $1)',
      args: ['Fantasy']
    })
    query({
      name: 'multiple joins on',
      query: sq.from`a`.join`b`.on`a.id = b.id`.join`c`.on`a.id = c.id`
        .on`b.id = c.id`,
      text:
        'select * from a join b on (a.id = b.id) join c on (a.id = c.id) and (b.id = c.id)'
    })
    query({
      name: '.and/.or',
      query: sq.from`a`.join`b`.on`a.id = b.id`.and`true`.or`false`,
      text: 'select * from a join b on (a.id = b.id) and (true) or (false)'
    })
  })
  describe('join using', () => {
    query({
      name: 'using template string',
      query: sq.from`book`.join`author`.using`author_id`,
      text: 'select * from book join author using (author_id)'
    })
    query({
      name: 'using string',
      query: sq.from`book`.join`author`.using('author_id'),
      text: 'select * from book join author using (author_id)'
    })
    query({
      name: 'using multiple strings',
      query: sq.from`a`.join`b`.using('x', 'y', 'z'),
      text: 'select * from a join b using (x, y, z)'
    })
    query({
      name: 'multiple using',
      query: sq.from`a`.join`b`.using`x`.using('y', 'z'),
      text: 'select * from a join b using (x, y, z)'
    })
    query({
      name: 'multiple join using',
      query: sq.from`a`.join`b`.using`x`.join`c`.using('y', 'z'),
      text: 'select * from a join b using (x) join c using (y, z)'
    })
    query({
      name: 'multiple join using',
      query: sq.from`a`.join`b`.using`x`.join`c`.on`a.id = c.id`,
      text: 'select * from a join b using (x) join c on (a.id = c.id)'
    })
  })
})
