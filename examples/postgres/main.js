const sqorn = require('sqorn')

const server = 'postgresql://postgres@localhost:5432/'
const adminDatabase = 'postgres'
const appDatabase = 'sqorn_postgres_example'

async function main() {
  // connect to admin database
  let sq = sqorn({ pg: { connectionString: server + adminDatabase } })
  // delete app database if it exists
  await sq.l`drop database if exists $${appDatabase}`
  // create app database
  await sq.l`create database $${appDatabase}`
  // disconnect from admin database
  await sq.end()
  // connect to created database
  sq = sqorn({ pg: { connectionString: server + appDatabase } })
  // create author table
  await sq.l`create table author (
    id              serial primary key,
    first_name      text,
    last_name       text,
    birthday        date
  )`
  // create book table
  await sq.l`create table book (
    id              serial primary key,
    title           text,
    genre           text,
    publish_year    integer,
    author_id       integer,
                    foreign key (author_id) references author (id)
  )`
  // populate author table
  const [sanderson, jordan, tolkien] = await sq`author`.return`id`.insert(
    {
      firstName: 'Brandon',
      lastName: 'Sanderson',
      birthday: '1975-12-19'
    },
    {
      firstName: 'Robert',
      lastName: 'Jordan',
      birthday: '1948-10-17'
    },
    {
      firstName: 'John',
      lastName: 'Tolkien',
      birthday: '1892-01-03'
    }
  )
  // populate book table
  await sq`book`.insert(
    {
      title: 'The Way of Kings',
      genre: 'Fantasy',
      publishYear: 2010,
      authorId: sanderson.id
    },
    {
      title: 'The Eye of the World',
      genre: 'Fantasy',
      publishYear: 1990,
      authorId: jordan.id
    },
    {
      title: 'The Fellowship of the Ring',
      genre: 'Fantasy',
      publishYear: 1954,
      authorId: tolkien.id
    }
  )
  // disconnect from database
  await sq.end()
}

main()
