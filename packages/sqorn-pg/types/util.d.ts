interface GroupItems extends Array<Expression | RollupItem | CubeItem | GroupingSetsItem | GroupItems> {}
interface ExpressionItems extends Array<Expression | ExpressionItems> {}

interface RollupItem {
  type: 'rollup'
  args: ExpressionItems
}
interface CubeItem {
  type: 'cube'
  args: ExpressionItems
}
interface GroupingSetsItem {
  type: 'grouping sets',
  args: GroupItems
}

export interface GroupByUtil {
  /**
   * **[ROLLUP item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates rollup grouping sets for use in a group by clause
   * 
```sql
rollup (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd'))
// select * from t group by rollup (a, (b, c)), d
```
   */
  rollup(...args: ExpressionItems): RollupItem

  /**
   * **[CUBE item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates cube grouping sets for use in a group by clause
   * 
```sql
cube (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a, c), (a), (b, c), (b), (c), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`], 'd'))
// select * from t group by cube (a, (b, c)), d
```
   */
  cube(...args: ExpressionItems): CubeItem

    /**
   * **[Grouping Sets item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates grouping sets for use in a group by clause
   * 
   * Accepts the same arguments as `.groupBy`. Grouping sets can be nested.
   * 
   * @example
```js
sq.from`t`.groupBy(
  sq.groupingSets(
    ['a', 'b', 'c'],
    sq.groupingSets(['a', 'b']),
    ['a'],
    [],
    sq.cube('a', 'b')
  )
)
// select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), (), cube (a, b))
```
   */
  groupingSets(...args: GroupItems): GroupingSetsItem
}