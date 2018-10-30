import * as Q from './queries'
import * as F from './states'
import { S as _S, U as _U, D as _D, I as _I, V as _V, M as _M } from './states'

export type StateToBuilder<T> =
  F.SUDIVM extends T ? SUDIVM : 
  F.SUDI extends T ? SUDI :
  F.SUD extends T ? SUD :
  F.SV extends T ? SV :
  F.S extends T ? S :
  F.V extends T ? V :
  F.I extends T ? I :
  F.U extends T ? U :
  F.D extends T ? D :
  F.M extends T ? M : never;

type x = StateToBuilder<F.SUD>

export type BuilderToState<T> =
  T extends SUDIVM ? F.SUDIVM : 
  T extends SUDI ? F.SUDI :
  T extends SUD ? F.SUD :
  T extends SV ? F.SV :
  T extends S ? F.S :
  T extends V ? F.V :
  T extends I ? F.I :
  T extends U ? F.U :
  T extends D ? F.D :
  T extends M ? F.M : never;

type X =  SUDI | SUD
type Y =  SUDI & SUD
type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

// type ConvertBuilerUnionToStateUnion<U> = 
//   (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? BuilderToState<I> : never


// Note: mapped types distribute over unions
// e.g. if fn<x, y> is conditional on x, then fn<a | b, c> = fn<a, c> | fn<b, c>
type Methods<T> = UnionToIntersection<QueryMethods<T, T>>
type QueryMethods<T, R> = 
  T extends F.S ? Q.Select<R> :
  T extends F.U ? Q.Update<R> :
  T extends F.D ? Q.Delete<R> :
  T extends F.I ? Q.Insert<R> :
  T extends F.V ? Q.Values<R> :
  T extends F.M ? Q.Manual<R> : never;

type MethodMap<T> = {
  S: Q.Select<T>
  U: Q.Update<T>
  D: Q.Delete<T>
  I: Q.Insert<T>
  V: Q.Values<T>
  M: Q.Manual<T>
};

type Methods2<T extends keyof MethodMap<T>> = UnionToIntersection<MethodMap<T>[T]>

type t = Methods<F.S | F.U | F.I>
type t2 = Methods2<'S' | 'U' | 'D' | 'I' | 'V' | 'M'>
type t3 = Methods2<'S' | 'U' | 'I'>
type t4 = Methods2<F.S | F.U | F.I>

export interface SUDIVM extends Methods<F.SUDIVM> {}
export interface SUDI extends Methods<F.SUDI> {}
export interface SUD extends Methods<F.SUD> {}
export interface SV extends Methods<F.SV> {}
export interface S extends Methods<F.S> {}
export interface U extends Methods<F.U> {}
export interface D extends Methods<F.D> {}
export interface I extends Methods<F.I> {}
export interface V extends Methods<F.V> {}
export interface M extends Methods<F.M> {}

