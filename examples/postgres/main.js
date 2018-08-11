const sqorn = require('../../src')
// const sqorn = require('sqorn') <-- use this instead in your program

const server = 'postgresql://postgres@localhost:5432/'
const adminDatabase = 'postgres'
const database = 'sqorn_postgres_example'

async function main() {
  try {
    // create new database
    let sq = sqorn({ pg: { connectionString: server + adminDatabase } })
    console.log('connected')
    await sq.l`drop database if exists $${database}`
    console.log('dropped')
    await sq.l`create database $${database}`
    console.log('created')
    sq.end()
    console.log('disconnected')
    return
    // create tables
    sq = sqorn({ pg: { connectionString: server + database } })
    await sq.l`create table author (
      id              serial primary key,
      first_name      text,
      last_name       text,
      birthday        date
    )`
    await sq.l`create table book (
      id              serial primary key,
      title           text,
      genre           text,
      publish_year    integer,
      author_id       integer,
                      foreign key (author_id) references author (id)
    )`
    sq.end()
    // in your terminal, start 'psql' and run '\list' to see your new database
  } catch (error) {
    throw error
  }
}

main()
