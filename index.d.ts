declare module 'sqorn' {



  /**
   * The sqorn SQL query builder
   */
  interface sq {

    /**
     * EXPRESS query builder - shorthand query syntax
     * 
     * First call is `.frm`. Second call is `.whr`. Third call is `.ret`.
     * Subsequent calls ignore.
     * 
     * @example
     * sq`book`
     * // select * from book
     * sq`book``pages > 7`
     * // select * from book where pages > 7
     * sq`book``pages > 7``title`
     * // select title from book where pages > 7
     * sq`book`({ pages: 70  })
     * // select * from book where pages = 70
     * sq`book`()`title`
     * // select title from book
     */
    (...args: any[]): sq

    /**
     * FROM clause - specify query table
     * 
     * Accepts a single table or a join between multiple tables.
     * 
     * @example
     * sq.frm`book`
     * // select * from book
     * sq.frm`book join comment`
     * // select * from book join comment
     * sq`book`
     * // select * from book
     */
    frm(strings: string[], ...args: any[]): sq

    /**
     * WHERE clause - specify query filters
     * 
     * @example
     * sq.frm`person`.whr`age < 18`
     * // select * from person where age < 18
     * sq.del.frm`person`.whr`age < 7`
     * // delete from person where age < 7
     * sq`person``age < 18`
     * // select * from person where age < 18
     */
    whr(strings: string[], ...args: any[]): sq

    /**
     * SELECT or RETURNING clause - specify columns query returns
     * 
     * @example
     * sq.ret`1, 2, 3`
     * // select 1, 2, 3
     * sq.del.frm`person`.ret`age`
     * // delete from person returning age
     * sq`person`()`age`
     * // select age from person
     */
    ret(strings: string[], ...args: any[]): sq

    /**
     * INSERT column - specify columns to insert using tagged template literal
     * 
     * The query must also include at least one call to`sq.val` specifing the value(s) to insert
     * 
     * @example
     * sq.frm`person`.ins`first_name, last_name`.val`'Carmen', 'San Diego'`
     * // insert into person (first_name, last_name) values ('Carment', 'San Diego')
     * sq.frm`person`.ins`age`.val`23`.val`40`.ret`id`
     * // insert into person (age) values (23), (40) returning id
     * sq`person`()`id`.ins`age`.val`23`.val`40`
     * // insert into person (age) values (23), (40) returning id
     */
    ins(strings: string[], ...args: any[]): sq
    /**
     * INSERT value - specify value(s) to insert as objects
     * 
     * @example
     * sq.frm`person`.ins({ firstName: 'Bob' })
     * // insert into person (first_name) values ('Bob')
     * sq.frm`person`.ins({ firstName: 'Bob' }, { lastName: 'Baker' })
     * // insert into person (first_name, last_name) values ('Bob', default), (default, 'Baker')
     * sq`person`()`id`.ins({ firstName: 'Bob' }
     * // insert into person (first_name) values ('Bob') returning id
     */
    ins(...values: object[]): sq

        /**
     * VALUE - specify values to insert as tagged template literals
     * 
     * The query must also include a call to`sq.ins` specifing the columns to insert into
     * 
     * @example
     * sq.frm`person`.ins`first_name, last_name`.val`'Carmen', 'San Diego'`
     * // insert into person (first_name, last_name) values ('Carment', 'San Diego')
     * sq.frm`person`.ins`age`.val`23`.val`40`.ret`id`
     * // insert into person (age) values (23), (40) returning id
     * sq`person`()`id`.ins`age`.val`23`.val`40`
     * // insert into person (age) values (23), (40) returning id
     */
    val(strings: string[], ...args: any[]): sq

    /**
     * DELETE - marks the query as a delete query
     * 
     * @example
     * sq.del.frm`person`
     * // delete * from person
     * sq.del.frm`person`.whr`age < 7`.ret`id`
     * // delete from person where age < 7 returning id
     * sq`person``age < 7``id`.del
     * // delete from person where age < 7 returning id
     */
    readonly del: sq

    /**
     * Compiles the query buillder state, returning the equivalent SQL query string
     * 
     * @example
     * sq.ret`1, 2, 3`.str === 'select 1, 2, 3'
     * sq.frm`person`.str === 'select * from person'
     */
    readonly str: string
  }

  /**
   * creates and returns a query builder with the given configuration
   * 
   */
  function configure(): sq

  export = configure
}

