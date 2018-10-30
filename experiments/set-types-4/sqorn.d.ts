import { Root } from './QUeries'

interface Configuration {
  /**
   * pg module - See [Node Postgres](https://node-postgres.com).
   * This argument is required to execute queries,
   * but can be skipped if you only want to build queries.
   * 
   * @example
   * const pg = require('pg')
   * const sqorn = require('sqorn-pg')
   * const pool = new pg.Pool()
   * const sq = sqorn({ pg, pool })
   */
  pg?: any
  /**
   * pg.Pool instance - See [Node Posgres](https://node-postgres.com/features/connecting).
   * This argument is required to execute queries,
   * but can be skipped if you only want to build queries.
   * If provided, you MUST also provide argument `pg`.
   * 
   * @example
   * const pg = require('pg')
   * const sqorn = require('sqorn-pg')
   * const pool = new pg.Pool()
   * const sq = sqorn({ pg, pool })
   */
  pool?: any
  /**
   * Function that maps input object keys.
   * If unspecified, the default mapping function converts keys to `snake_case`.
   * 
   * @example
   * const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })
   * 
   * sq.from({ p: 'person' }).return({ name: 'first_name' }).query
   * 
   * { text: 'select first_name as NAME from person as P',
   *   args: [] }
   * */
  mapInputKeys?: (key: string) => string
  /**
   * Function that maps output object keys.
   * If unspecified, the default mapping function converts keys to `camelCase`.
   * 
   * @example
   * const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })
   * 
   * await sq.from('person').return('first_name')
   * 
   * [{ FIRST_NAME: 'Jo'}, { FIRST_NAME: 'Mo' }]
   * */
  mapOutputKeys?: (key: string) => string
}


/**
* Creates and returns a query builder with the given configuration
* 
* @example
* const pg = require('pg')
* const sqorn = require('sqorn-pg')
* const pool = new pg.Pool()
* const sq = sqorn({ pg, pool })
*/
export declare function sqorn(config?: Configuration): Root