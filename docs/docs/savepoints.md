
### Savepoints

TODO

NOTE: Rolling back a save point does not release it. You can keep on rolling back to it.

*Savepoints* are conceptually transactions within transactions. Create them with `trx.transaction`, which has the same signature as `sq.transaction`.

The query below shows how savepoints can be sequenced and nested. Note that each callback's `trx` shadows the encompassing scope's `trx`.

```js
const query = n => sq.l`insert into t(n) values ($${n})`
await sq.transaction(async trx => {
  await query(1).all(trx)
  await trx.transaction(async trx => {
    await query(2).all(trx)
    await trx.transaction(query(3).all)
    await query(4).all(trx)
  })
  await trx.transaction(query(5).all)
  await query(6).all(trx)
})
```

It generates the following SQL if all queries are successful.

```sql
begin;
  insert into t(n) values (1);
  savepoint sp1;
    insert into t(n) values (2);
    savepoint sp2;
      insert into t(n) values (3);
    release savepoint sp2;
    insert into t(n) values (4);
  release savepoint sp1;
  savepoint sp3;
    insert into t(n) values (5);
  release savepoint sp3;
  insert into t(n) values (6);
commit;
```

Like `sq.transaction`,`trx.transaction` returns a promise for its callback's return value and rolls back on uncaught errors.

Savepoints should generally be nested within `try-catch` blocks, otherwise a single error will rollback the whole transaction, not just the savepoint's queries.

```js
const query = n => sq.l`insert into t(n) values ($${n})`
await sq.transaction(async trx => {
  await query(1).all(trx)
  try {
    await trx.transaction(async trx => {
      await query(2).all(trx)
      throw Error('oops')
    })
  } catch (error) {}
  await query(3).all(trx)
})
```

The generated SQL shows query 1 is executed, query 2 is rolled back, and query 3 is executed. Without the `try-catch` block, all would be rolled back.

```sql
begin;
  insert into t(n) values (1);
  savepoint sp1;
    insert into t(n) values (2);
  rollback to savepoint sp1;
  insert into t(n) values (3);
commit;
```

Like transactions, savepoints are lazy. No transaction or savepoint is created until a query in its scope or one of its nested scopes is executed.

Similarly, no savepoint is released until its scope has ended and another query is executed or an error is thrown.

```js
await sq.transaction(async trx => {
  // no transaction created because no query executed

  await trx.transaction(async trx => {
    // no savepoint created because no query executed
  }

  await trx.transaction(async trx => {
    await trx.transaction(async trx => {
      // Query encountered:
      // 1. begin;
      // 2. savepoint sp1;
      // 3. savepoint sp2;
      // 4. insert into t(n) values (1);
      await sq.l`insert into t(n) values (1)`.all(trx)
    })
  })

  // Query encountered:
  // 1. release savepoint sp2;
  // 2. release savepoint sp1;
  // 3. insert into t(n) values (2);
  await sq.l`insert into t(n) values (2)`.all(trx)

  // End of transaction:
  // commit;
})
```

Releasing and rolling back savepoints is also lazy.

```js
await sq.transaction(async trx => {
  try {
    await trx.transaction(async trx => {
      await trx.transaction(async trx => {
        // Query encountered:
        // begin;
        // 1. savepoint sp1;
        // 2. savepoint sp2;
        // 3. insert into t(n) values (1);
        await sq.l`insert into t(n) values (1)`.all(trx)
      })
      // Query encountered:
      // 1. release savepoint sp2;
      // 2. insert into t(n) values (2);
      await sq.l`insert into t(n) values (2)`.all(trx)
      throw Error('oops')
    })
    // Outer trx.transaction catches error:
    // 1. rollback to savepoint sp1;
    // 2. rethrows error
  } catch (error) { // handle error }
})
```

Object savepoints work just like object transaction. Create them with `trx.transaction()`. `trx.commit` and `trx.rollback` mark a savepoint for release or rollback. `trx.status` work as usual. `trx.end()` has no effect but is included for composability.

Once 

```js
  const trx = sq.transaction()
  const sp1 = trx.transaction()
  await sq.l`insert into t(n) values (1)`.all(sp1)
  const sp2 = trx.transaction()
  await sq.l`insert into t(n) values (2)`.all(sp2)
  sp2.rollback()
  sp1.commit()
  await sq.l`insert into t(n) values (3)`.all(trx)
  await trx.end()
})
```

The following SQL is generated:

```sql
begin;
  savepoint sp1;
    insert into t(n) values (1);
    savepoint sp2:
      insert into t(n) values (2);
    rollback to savepoint sp2;
  release savepoint sp1;
  insert into t(n) values (3);
commit;
```

Concurrent savepoints are executed serially. Descendent savepoints are executed before sibling savepoints.

```js
await sq.transaction(async trx => {
  await Promise.all([
    trx.transaction(sq.l`insert into t values (1))`.all),
    sq.l`insert into t values (2))`.all(trx),
    trx.transaction(async trx => {
      await sq.l`insert into t values (3))`.all(trx)
      await sq.l`insert into t values (4))`.all(trx)
    }),
    sq.l`insert into t values (5))`.all(trx),
    async () => {
      const trx = trx.transaction()
      await sq.l`insert into t values (6))`.all(trx),
      trx.commit()
    },
  ])
})
```

```sql
begin;
  savepoint sp1;
    insert into t(n) values (1);
    savepoint sp2:
      insert into t(n) values (2);
    rollback to savepoint sp2;
  release savepoint sp1;
  insert into t(n) values (3);
commit;
```

<!-- ### Laziness -->

<!-- At most one child of a transaction may be active at a time.

query() behaviour:
* `init` - execute all `begin;` and `savepoint` statements, execute query, set status to `begin` for success or `error` for failure
* `parent_pending` - defer until status change
* `pending` - defer until status change, execute query, set status to `begin`
* `begin` - execute query, set status to `error` on failure
* `init_blocked`, `begin_blocked` - delay until status changes, then follow query() behaviour again
* `error` - throw error
* `commit` - throw error and set status to `error`
* `rollback` - throw error and set status to `error`
* `none` - change status to er
* `end` -  -->

<!-- #### Actions -->

<!-- * savepoint_begin - child = trx.transaction() called
* savepoint_end - child.commit(), child.rollback() or child.end() called
* query_success - query(trx) succeeded
* query_failure - query(trx) failed
* commit - trx.commit() called
* rollback - trx.rollback() called
* end - trx.end() called
* error -  -->

<!-- #### Status -->

<!-- * `'init'`
  * : `transaction()`
  * init_child: `child.commit()`
  * init_child: `child.rollback()`
* `'begin'`
  * init: `query()` success
  * begin: `query()` success
  * init_begin: `child.commit()`
  * init_begin: `child.rollback()`
* `'init_blocked'`
  * init: `transaction()`
* `'begin_blocked'`
  * begin: `transaction()`
* `'error'`
  * init: `query()` failure
  * begin: `query()` failure
  * any: method call with undefined transition
* `'commit'` - `commit()` was called on status `'begin'` or `'error'`
* `'rollback'` - `rollback()` was called on status `'begin'`
* `'none'` - `commit()` or `rollback()` was called on status `'init'`
* `'end'` - `end()` was called on any status -->

<!-- #### Rules -->

<!-- * `sq.transaction()`
  * return new transaction object `trx` with status = `init`, type = `transaction`

* `trx.transaction()`
  * if status in [`init`, `begin`]
    * return new savepoint object `trx` with status = `init`, type = `savepoint`
  * else
    * status = `error`
    * throw Error

* `trx.query()` success
  * if status is 

* `trx.commit()`
  * if status is `init`
    * status = `none`
  * If status is 

* `trx.rollback()`

* query success

* query failure

* `trx.end()`

* A transaction issues `begin;` at its first direct or nested query. 

* A savepoint issues `savepoint id;` at its first direct or nested query.

* When `end()` is called, a transaction issues:
    * If `commit;` if 
    * `rollback;` -->