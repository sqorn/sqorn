import * as M from "./methods"
import { Extend } from './extend'

export type A = 'A' // Any
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
  A: Any<T>
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
export type RequiredKeys = A | S | U | D | I | V | M

export type Root = Query<Except<Keys, X>>

// Returns the a set of states, e.g. 'S' | 'U', returns 
export type Query<T extends Keys> = UnionToIntersection<MethodMap<T>[T]>

// The inverse of Query: States<Query<T>> = T
export type States<T> =
  (T extends Any<any> ? A : never) |
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

interface Execute<T>
  extends
  M.Buildable<T>,
  M.Executable<T> { }

interface Any<T extends Keys>
  extends
  M.Link<T>,
  Extend<T>,
  Guard { }

interface Guard {
  isExecutable<
    U extends States<this> | X
    >(): this is Query<U> & Execute<U> & this // final & T is only there to meet requirements
}

declare function isExecutable<T extends Any<any>, U extends States<T> | X>
  (a: T): a is Query<U> & Execute<U> & T;