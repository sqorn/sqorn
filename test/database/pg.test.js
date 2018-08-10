const sqorn = require('../src/index.js')

const db_name = 'sqorn_pg_test'

async function setupDatabase() {
  const sq = sqorn({
    client: 'pg',
    connection: {
      connectionString: 'postgresql://postgres@localhost:5432/postgres'
    }
  })
  await sq.l`drop database if exists $${db_name}`.run()
  await sq.l`create database $${db_name}`.run()
  sq.end()
}

let sq
async function setupSQ() {
  sq = sqorn({
    client: 'pg',
    connection: {
      // username: postgres, no password, database name: sqorn_test
      connectionString: `postgresql://postgres@localhost:5432/${db_name}`
    }
  })
}

beforeAll(async () => {
  await setupDatabase()
  await setupSQ()
})
afterAll(async () => {
  sq.end()
})

test('database starts empty', async () => {
  const tables = await sq`pg_catalog.pg_tables``schemaname = 'public'`.all()
  expect(tables.length).toBe(0)
  // expect(sq`pg_catalog.pg_tables``schemaname = 'public'``tablename name`.all()).toBe(true)
})

test('database starts empty', async () => {
  const tables = await sq`pg_catalog.pg_tables``schemaname = 'public'`.all()
  expect(tables.length).toBe(0)
  // expect(sq`pg_catalog.pg_tables``schemaname = 'public'``tablename name`.all()).toBe(true)
})

test('select - .frm``', () => {
  expect(sq.frm`person`.str).toBe('select * from person')
})

test('select - .frm``', async () => {
  expect(await sq.frm`book`.all()).toBe('select * from person')
})
