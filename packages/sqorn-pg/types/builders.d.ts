import { Buildable } from './buildable'
import { Executable } from './executable'
import { GroupByUtil } from './util'
import {
  Link,
  Extend,
  With,
  Return,
  Distinct,
  From,
  Join,
  Where,
  GroupBy,
  Having,
  SetOperators,
  OrderBy,
  Limit,
  Offset,
  Set,
  Delete,
  Insert,
  Values,
  Manual,
  Raw
} from './methods'
import { CreateExpression } from './expressions'

interface QueryBuilder extends Buildable, Executable, Link, Extend {}

export interface AnyBuilder
  extends SelectBuilder, UpdateBuilder, DeleteBuilder, InsertBuilder, ValuesBuilder, ManualBuilder, FragmentBuilder {}

interface SelectBuilder
  extends With, Distinct, Return, From, Join, Where, GroupBy, Having, SetOperators, OrderBy, Limit, Offset {}

interface UpdateBuilder extends With, From, Return, Where, Set {}

interface DeleteBuilder extends With, From, Return, Where, Delete {}

interface InsertBuilder extends With, From, Insert, Return {}

interface ValuesBuilder extends Values, OrderBy, Limit, Offset {}

export interface ManualBuilder extends Manual {}

export interface FragmentBuilder extends Manual {}

interface ExpressionBuilder extends Buildable {
  e: CreateExpression;
}

interface Util extends GroupByUtil {}

interface End {
  /**
   * Closes the database connection.
   *
   * Subsequent attempts to execute using the query builder will fail.
   */
  end(): Promise<void>;
}
