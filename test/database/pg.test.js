const sqorn = require('../../src')
const db_name = 'sqorn_pg_test'

const adminConnection = {
  pg: {
    connectionString: 'postgresql://postgres@localhost:5432/postgres'
  }
}

const connection = {
  pg: {
    // username: postgres, no password, database name: sqorn_test
    connectionString: `postgresql://postgres@localhost:5432/${db_name}`
  }
}

describe('pg', async () => {
  beforeAll(async () => {
    const sq = sqorn(adminConnection)
    await sq.l`drop database if exists $${db_name}`
    await sq.l`create database $${db_name}`
    sq.end()
  })
  const sq = sqorn(connection)
  afterAll(async () => {
    sq.end()
  })
  test('db empty', async () => {
    expect(
      await sq.frm`pg_catalog.pg_tables`.whr`schemaname = 'public'`
    ).toEqual([])
  })
  test('create table author', async () => {
    expect(
      await sq.l`create table author (
        id              serial primary key,
        first_name      text,
        last_name       text,
        birthday        date
      )`
    ).toEqual([])
  })
  test('create table book', async () => {
    expect(
      await sq.l`create table book (
        id              serial primary key,
        title           text,
        genre           text,
        publish_year    integer,
        author_id       integer,
                        foreign key (author_id) references author (id)
      )`
    ).toEqual([])
  })
  test('insert authors', async () => {
    expect(
      await sq`author`.ret`first_name, last_name`.ins(
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
    ).toEqual([
      {
        firstName: 'Brandon',
        lastName: 'Sanderson'
      },
      {
        firstName: 'Robert',
        lastName: 'Jordan'
      },
      {
        firstName: 'John',
        lastName: 'Tolkien'
      }
    ])
  })
  test('insert books', async () => {
    expect(
      await sq`book`.ret`title, publish_year`.ins(
        {
          title: 'The Way of Kings',
          genre: 'Fantasy',
          publishYear: 2010,
          authorId: 1
        },
        {
          title: 'The Eye of the World',
          genre: 'Fantasy',
          publishYear: 1990,
          authorId: 2
        },
        {
          title: 'The Fellowship of the Ring',
          genre: 'Fantasy',
          publishYear: 1954,
          authorId: 3
        }
      )
    ).toEqual([
      {
        title: 'The Way of Kings',
        publishYear: 2010
      },
      {
        title: 'The Eye of the World',
        publishYear: 1990
      },
      {
        title: 'The Fellowship of the Ring',
        publishYear: 1954
      }
    ])
  })
  test('select author', async () => {
    expect(
      await sq.frm`author`.whr({ firstName: 'Brandon' }).ret`last_name`
    ).toEqual([{ lastName: 'Sanderson' }])
  })
  test('update book', async () => {
    expect(
      await sq.frm`book`
        .ret('id', 'publish_year')
        .whr({ title: 'The Way of Kings' })
        .set({ genre: 'Adventure' })
    ).toEqual([{ id: 1, publishYear: 2010 }])
  })
  test('select book', async () => {
    expect(await sq.frm`book`.whr({ genre: 'Adventure' }).ret`id`).toEqual([
      { id: 1 }
    ])
  })
  test('delete book', async () => {
    expect(
      await sq.frm`book`.del.ret`id`.whr({ title: 'The Way of Kings' })
    ).toEqual([{ id: 1 }])
  })
  test('select book', async () => {
    expect(await sq.frm`book`.ret`id`).toEqual([{ id: 2 }, { id: 3 }])
  })
})
