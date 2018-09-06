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
     * Accepts table as template string
     * 
     * @example
     * sq.frm`book`
     * // select * from book
     * sq.frm`book join comment`
     * // select * from book join comment
     * sq.frm`$${'book'}`
     * // select * from book
     * sq`book`
     * // select * from book
     */
    frm(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * FROM clause - specify query table
     * 
     * Accepts array of tables names
     * 
     * @example
     * sq.frm('book')
     * // select * from book
     * sq.frm('book', 'author', 'vote')
     * // select * from book, author, vote
     */
    frm(...tables: string[]): sq

    /**
     * WHERE clause - specify query filters
     * 
     * Accepts WHERE conditions as template string. Multiple calls to `.whr`
     * are joined with `'and'`.
     * 
     * @example
     * sq.frm`person`.whr`age < ${18}`
     * // select * from person where age < 18
     * sq.del.frm`person`.whr`age < ${7}`
     * // delete from person where age < 7
     * sq.frm`person`.whr`age < ${7}`.set`group = ${'infant'}`
     * // update person set group = 'infant' where age < 7
     * sq.frm`person`.whr`age > ${3}`.whr`age < ${7}`
     * // select * from person where age > 3 and age < 7
     * sq`person``age < ${18}`
     * // select * from person where age < 18
     */
    whr(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * WHERE clause - specify query filters
     * 
     * Accepts conditions as objects. Object keys are column names tested for
     * equality against object values. Use values of type `sq` to build
     * non-equality conditions. Keys within an object are joined with `'and'`,
     * while objects are joined with `'or'`. Multiple calls to `.whr` are
     * joined with `'and'`.
     * 
     * @example
     * sq.frm`person`.whr({ age: 17 })
     * // select * from person where age = 17
     * sq.frm`person`.whr({ minAge: sq.l`age < ${17}` })
     * // select * from person where age = 17
     * sq.frm`person`.whr({ age: 7, gender: 'male' }, { name: 'Jo' })
     * // select * from person where age = 7 and gender = 'male' or name = 'Jo'
     * sq.frm`person`.whr({ age: 7 }).whr({ name: 'Joe' })
     * // select * from person where age = 7 and name = 'Joe'
     */
    whr(...conditions: { [key: string]: any }[]): sq

    /**
     * SELECT or RETURNING clause - specify columns query returns
     * 
     * Accepts columns as template string
     * 
     * @example
     * sq.ret`1, 2, 3`
     * // select 1, 2, 3
     * sq.frm`book.`ret`title`
     * // select title from book
     * sq.del.frm`person`.ret`id, age`
     * // delete from person returning id, age
     * sq.frm`person`.set`age = age + 1`.ret`id, age`
     * // update person set age = age + 1 returning id, age
     * sq.frm`person`.ins`age`.val`${12}`.ret`id, age`
     * // insert into person (age) values (12) returning id, age
     * sq`person``age > ${7}``id, age`
     * // select id, age from person where age > 7
     */
    ret(strings: TemplateStringsArray, ...args: any[]): sq

    /**
     * SELECT or RETURNING clause - specify columns query returns
     * 
     * Accepts columns as strings
     * 
     * @example
     * sq.ret('1', '2', '3')
     * // select 1, 2, 3
     * sq.frm('book').ret('title')
     * // select title from book
     * sq.del.frm('person').ret('id', 'age')
     * // delete from person returning id, age
     * sq.frm('person').set`age = age + 1`.ret('id', 'age')
     * // update person set age = age + 1 returning id, age
     * sq.frm('person').ins('age').val(12).ret('id', 'age')
     * // insert into person (age) values (12) returning id, age
     * sq`person``age > ${7}`('id', 'age')
     * // select id, age from person where age > 7
     */
    ret(...columns: string[]): sq

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
    ins(strings: TemplateStringsArray, ...args: any[]): sq
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
    val(strings: TemplateStringsArray, ...args: any[]): sq

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

