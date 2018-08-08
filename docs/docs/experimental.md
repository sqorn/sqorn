```js
const { qry, frm, whr, ret, ord, lim } = require('sqorn')

const getTimeRange = time => {
    switch (time) {
      case 'day': return '1 day'
      case 'week': return '7 days'
      case 'month': return '30 days'
      case 'year': return '365 days'
  }
}

const getTopPosts = ({ time, topic, user, max = 25 }) => {
  const range = getTimeRange(time)
  return qry(
    frm`post`,
    user && whr({ user }),
    topic && whr({ topic }),
    range && whr`create_time >= now() - $${timeRange}`,
    ord`score asc`,
    max && lim(max),
    ret`id, name, age`
  )
}


// ex

const Post = sq(frm`post`)
const TopicPost Post({ topic }, ret`id`, lim(5), ord.dsc`score`)
```

```sql
select b.ID book_id, b.name book_name, c.name category_name, 
    (select count(*) from articles a where a.book_id = b.id) article_count
from BOOKS b
  inner join category c on c.id = b.category_id and c.kind = 'science'
where b.id >= 1 and b.id < 100 and b.name like ? and (release_date between ? and ?
        or release_date between to_date('2015-01-01', 'yyyy-mm-dd') and to_date('2016-01-01', 'yyyy-mm-dd'))
    and c.name in ('novel','horror','child')
    and (select name from author where id = b.author_id) = 'Jessica Parker'
order by c.name, b.release_date desc
```

```js
  const sub = sq`articles a``a.book_id = b.id``count(*)`

```