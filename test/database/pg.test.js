const sqorn = require('../../src')
const db_name = 'sqorn_pg_test'

const query = ({ name, qry, res }) =>
  test(name, async () => {
    expect(await qry).toEqual(res)
  })

async function setupDatabase() {
  const sq = sqorn({
    pg: {
      connectionString: 'postgresql://postgres@localhost:5432/postgres'
    }
  })
  await sq.l`drop database if exists $${db_name}`.run()
  await sq.l`create database $${db_name}`.run()
  sq.end()
}

async function setupSQ() {
  return sqorn({
    pg: {
      // username: postgres, no password, database name: sqorn_test
      connectionString: `postgresql://postgres@localhost:5432/${db_name}`
    }
  })
}

describe('pg', () => {
  let sq
  beforeAll(async () => {
    await setupDatabase()
    sq = await setupSQ()
  })
  afterAll(async () => {
    sq.end()
  })
  describe('setup database', () => {
    test('database starts empty', async () => {
      const tables = await sq`pg_catalog.pg_tables``schemaname = 'public'`.all()
      expect(tables.length).toBe(0)
      // expect(sq`pg_catalog.pg_tables``schemaname = 'public'``tablename name`.all()).toBe(true)
    })
  })
  describe('populate', () => {
    query({
      name: 'select - .frm``',
      qry: sq.frm`book`.all(),
      res: []
    })
  })
})
