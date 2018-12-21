const { sq, e, query } = require('../tape')

describe('about', () => {
  query({
    name: 'SQL Query Builder',
    query: sq
      .return({ authorId: 'a.id', name: 'a.last_name' })
      .distinct.from({ b: 'book' })
      .leftJoin({ a: 'author' }).on`b.author_id = a.id`.where({
      title: 'Oathbringer',
      genre: 'fantasy'
    }),
    text:
      'select distinct a.id author_id, a.last_name name from book b left join author a on (b.author_id = a.id) where (title = $1) and (genre = $2)',
    args: ['Oathbringer', 'fantasy']
  })
  query({
    name: 'Manual Query Builder',
    query: sq.sql`select a.author_id, json_agg(b.*)`.sql`from author a`
      .sql`left join book b using (author_id)`
      .sql`where a.last_name like ${'[S]%'}`.sql`group by a.author_id`
      .sql`having ${sq.txt`count(*) >`.txt(5)}`,
    text:
      'select a.author_id, json_agg(b.*) from author a left join book b using (author_id) where a.last_name like $1 group by a.author_id having count(*) > $2',
    args: ['[S]%', 5]
  })
  query({
    name: 'Manual Query Builder',
    query: sq
      .from('book')
      .where(
        e`id`
          .eq(e.add(3, 20).sub(5))
          .or(
            e.eq`genre`('Fantasy').not,
            e.in`title`(['1984', 'Moby Dick', 'Oathbringer'])
          )
      ),
    text:
      'select * from book where ((id = (($1 + $2) - $3)) or not((genre = $4)) or (title in ($5, $6, $7)))',
    args: [3, 20, 5, 'Fantasy', '1984', 'Moby Dick', 'Oathbringer']
  })
})
