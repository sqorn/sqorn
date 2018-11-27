import * as M from "./methods"
import { Extend } from './extend'

export type A = 'A' // All
export type S = 'S' // Select
export type U = 'U' // Update
export type D = 'D' // Delete
export type I = 'I' // Insert
export type V = 'V' // Values
export type M = 'M' // Manual
export type H = 'H' // Helper
export type X = 'X' // Execute

/** UnionToIntersection<A | B | C> = A & B & C */
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never
  ) extends ((k: infer I) => void) ? I : never

/** Except<A | B | C, C> = A | B */
type Except<T, U> = T extends U ? never : T

type MethodMap<T extends Keys> = {
  A: All<T>
  S: Select<T>
  U: Update<T>
  D: Delete<T>
  I: Insert<T>
  V: Values<T>
  M: Manual<T>
  H: Helper<T>
  X: Execute<T>
};
export type Keys = keyof MethodMap<any>
export type RequiredKeys = S | U | D | I | V | M

export type Root = Query<Except<Keys, X>>

// Returns the a set of states, e.g. 'S' | 'U', returns 
export type Query<T extends Keys> = UnionToIntersection<MethodMap<T>[T]>

// The inverse of Query: States<Query<T>> = T
export type States<T> =
  (T extends Select<any> ? S : never) |
  (T extends Update<any> ? U : never) |
  (T extends Delete<any> ? D : never) |
  (T extends Insert<any> ? I : never) |
  (T extends Values<any> ? V : never) |
  (T extends Manual<any> ? M : never) |
  (T extends Helper<any> ? H : never) |
  (T extends Execute<any> ? X : never)

interface SQ<T> { status: string }

interface Select<T extends Keys>
  extends
  M.With<T>,
  M.From<T>,
  M.Return<T>,
  M.Where<T>,
  M.Order<T>,
  M.Limit<T>,
  M.Offset<T>,
  M.Group<T>,
  M.Having<T> { }

interface Update<T extends Keys>
  extends
  M.With<T>,
  M.From<T>,
  M.Return<T>,
  M.Where<T>,
  M.Set<T> { }

interface Delete<T extends Keys>
  extends
  M.With<T>,
  M.From<T>,
  M.Return<T>,
  M.Where<T>,
  M.Delete<T> { }

interface Insert<T extends Keys>
  extends
  M.With<T>,
  M.From<T>,
  M.Return<T>,
  M.Insert<T> { }

interface Values<T extends Keys>
  extends
  M.Order<T>,
  M.Limit<T>,
  M.Offset<T>,
  M.Values<T> { }

interface Manual<T extends Keys>
  extends
  M.SQL<T>,
  M.Raw<T> { }

interface Helper<T extends Keys>
  extends M.End<T>,
  M.Transaction<T> { }

interface Execute<T extends Keys>
  extends
  M.Buildable<T>,
  M.Execute<T> { }

interface All<T extends Keys>
  extends
  M.Link<T>,
  Extend<T>,
  Guard { }

type NameMap = {
  A: A
  All: A
  S: S
  Select: S
  U: U
  Update: U
  D: D
  Delete: D
  I: I
  Insert: I
  V: V
  Values: V
  M: M
  Manual: M
  H: H
  Helper: H
  X: X
  Execute: X
}

type Aliases = Except<keyof NameMap, Keys>
type AliasToSymbol<T extends Aliases> = NameMap[T]


interface Guard {
  // isExecute<
  //   U extends States<this> | X,
  //   >(): this is Query<U> & Execute<U>
  /**
   * 
   */
  can<
    T0 extends Aliases,
    Z extends States<this> | AliasToSymbol<T0>,
    >(t0: T0): this is Query<Z> & Execute<Z>
  /**
   * Returns whether an executable query of the given type
   * has been constructed.
   * 
   * If you want to know whether a query can be of a given type,
   * use method `.can` instead.
   * 
   * This method is useful as typescript typeguard.
   * 
   * @param type - one of `"select" | "update" | "delete" | "insert" | "values" | "manual"`
   * 
   * @example
   * const limit = sq.limit(1)
   * const from = sq.from('book')
   * const delete = from.delete
   * 
   * limit.is('select')
   * // false - "limit 1" is not executable
   * from.is('select')
   * // true - "select * from book"
   * delete.is('delete')
   * // true - "delete from book"
   * delete.is('select')
   * // false - query is not of type 'Delete'
   * sq.l`hi`.is('manual')
   * // true - all manual queries are executable
   */
  is<
    Type extends Aliases,
    Z extends States<this> | AliasToSymbol<Type> | X,
    >(type: Type): this is Query<Z> & Execute<Z>

  is<
    T0 extends Aliases,
    T1 extends Aliases,
    Z extends States<this> | AliasToSymbol<T0> | AliasToSymbol<T1>,
    >(t0: T0, t1: T1): this is Query<Z> & Execute<Z>
  is<
    T0 extends Aliases,
    T1 extends Aliases,
    T2 extends Aliases,
    Z extends States<this> | AliasToSymbol<T0> | AliasToSymbol<T1> | AliasToSymbol<T2>,
    >(t0: T0, t1: T1, t2: T2): this is Query<Z> & Execute<Z>
  is<
    T0 extends Aliases,
    T1 extends Aliases,
    T2 extends Aliases,
    T3 extends Aliases,
    Z extends States<this> | AliasToSymbol<T0> | AliasToSymbol<T1> | AliasToSymbol<T2> | AliasToSymbol<T3>,
    >(t0: T0, t1: T1, t2: T2, t3: T3): this is Query<Z> & Execute<Z>
  is<
    T0 extends Aliases,
    T1 extends Aliases,
    T2 extends Aliases,
    T3 extends Aliases,
    T4 extends Aliases,
    Z extends States<this> | AliasToSymbol<T0> | AliasToSymbol<T1> | AliasToSymbol<T2> | AliasToSymbol<T3> | AliasToSymbol<T4>,
    >(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): this is Query<Z> & Execute<Z>
}
