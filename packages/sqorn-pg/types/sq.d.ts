import * as M from './methods'
import { ExpressionBuilder } from './expression'

export interface SQ
  extends Select, UpdateBuilder, DeleteBuilder, InsertBuilder, ValuesBuilder, ManualBuilder, FragmentBuilder, Helper, Execute, All, ExpressionBuilder {}

interface Select
  extends M.With, M.Distinct, M.Return, M.From, M.Join, M.Where, M.GroupBy, M.Having, M.SetOperators, M.OrderBy, M.Limit, M.Offset {}

interface UpdateBuilder
  extends M.With, M.From, M.Join, M.Return, M.Where, M.Set {}

interface DeleteBuilder
  extends M.With, M.From, M.Join, M.Return, M.Where, M.Delete {}

interface InsertBuilder extends M.With, M.From, M.Return, M.Insert {}

interface ValuesBuilder extends M.OrderBy, M.Limit, M.Offset, M.Values {}

interface ManualBuilder extends M.Manual, M.Raw {}

interface FragmentBuilder extends M.Manual, M.Raw {}

interface Helper extends M.End, M.TransactionMethods, M.GroupHelpers {}

interface Execute extends M.Buildable, M.Execute {}

interface All extends M.Link, M.Extend {}
