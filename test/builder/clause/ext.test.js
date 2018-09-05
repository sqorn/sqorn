const { sq, query } = require('../tape')

describe('ext', () => {
  describe('template string', () => {
    query({
      name: 'frm',
      qry: sq.ext(sq.frm`book`),
      txt: 'select * from book'
    })
    query({
      name: 'frm - 2 calls',
      qry: sq.ext(sq.frm`book`, sq.frm`author`),
      txt: 'select * from author'
    })
    query({
      name: '2 calls',
      qry: sq.ext(sq.frm`book`, sq.whr`year > 2000`, sq.ret`title`),
      txt: 'select title from book where year > 2000'
    })
    query({
      name: '3 calls',
      qry: sq.ext(
        sq.frm`book`,
        sq.whr`year > 2000`,
        sq.whr`genre = 'fantasy'`,
        sq.ret`title`
      ),
      txt: `select title from book where year > 2000 and genre = 'fantasy'`
    })
    query({
      name: 'chained call',
      qry: sq.ext(sq.frm`book`.whr`year > 2000`, sq.ret`title`),
      txt: 'select title from book where year > 2000'
    })
    query({
      name: 'chained .ext',
      qry: sq.ext(sq.frm`book`.whr`year > 2000`).ret`title`,
      txt: 'select title from book where year > 2000'
    })
    query({
      name: 'args',
      qry: sq.ext(
        sq.frm`book`,
        sq.whr`year > ${2000}`,
        sq.whr`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.ret`title`
      ),
      txt:
        'select title from book where year > $1 and genre = $2 or genre = $3',
      arg: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      qry: sq.ext(
        sq.frm`book`.whr`year > ${2000}`,
        sq.whr`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.ret`title`
      ),
      txt:
        'select title from book where year > $1 and genre = $2 or genre = $3',
      arg: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      qry: sq.ext(sq.frm`book`.whr`year > ${2000}`, sq.ret`title`)
        .whr`genre = ${'fantasy'} or genre = ${'history'}`,
      txt:
        'select title from book where year > $1 and genre = $2 or genre = $3',
      arg: [2000, 'fantasy', 'history']
    })
  })
})
