export type Lit = string | number | boolean | undefined | null | void | {};

// infers a tuple type for up to twelve values (add more here if you need them)
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit, K extends Lit, L extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L): [A, B, C, D, E, F, G, H, I, J, K, L];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit, K extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K): [A, B, C, D, E, F, G, H, I, J, K];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J): [A, B, C, D, E, F, G, H, I, J];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): [A, B, C, D, E, F, G, H, I];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): [A, B, C, D, E, F, G, H];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): [A, B, C, D, E, F, G];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F): [A, B, C, D, E, F];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit>(a: A, b: B, c: C, d: D, e: E): [A, B, C, D, E];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit>(a: A, b: B, c: C, d: D): [A, B, C, D];
export function tuple<A extends Lit, B extends Lit, C extends Lit>(a: A, b: B, c: C): [A, B, C];
export function tuple<A extends Lit, B extends Lit>(a: A, b: B): [A, B];
export function tuple<A extends Lit>(a: A): [A];
export function tuple(...args: any[]): any[] {
  return args;
}

let sq: SQ<{}>;

// type add<T extends any[]> = [E for E in T]

export type Simplify<T> = { [key in keyof T]: T[key]};

type t1 = { a: number } & { b: number }
type t2 = Simplify<t1>
declare let tt2: t2;
tt2.a;

type Types = string | number

interface C<Type extends Types, Name extends string> {
  type: Type
  name: Name
}

type Column = C<Types, string>

type CtoR<T extends Column> = { [key in T["name"]]: T["type"] }

interface Row {
  [name: string]: any
}

type x = CtoR<C<number, 'id'>>
type x2 = Simplify<CtoR<C<number, 'id'>> & CtoR<C<string, 'name'>>>

// declare function column<Type, Name>(type, name): C<Type, Name>;

interface Book {
  id: C<number, 'id'>,
  title: C<string, 'title'>
}

declare let book: Book;

export type Simplify2<T> = {[TKey in keyof T]: T[TKey]};

const s = sq.select(book.id)
type st = typeof s
const s2 = s.select(book.title)
type s2t = typeof s2

// sq.selectDistinctOn()().from().where().groupBy().having()
// sq.selectDistinctOn('a')('a', 'b').from().where().groupBy().having().orderBy().limit().offset().all()
// sq.select('').from(book).naturalLeftJoin(author).on()

interface SQ<T extends Row> {
  select<F1 extends Column>(f1: F1): SelectFrom<{ [key in F1["name"]]: F1["type"] }>
  // select<F1 extends Column>(f1: F1): SelectFrom<Simplify<Row<F1>>>
}

interface SelectFrom<T extends Row> {
  // select<F1 extends Column>(f1: F1): SelectFrom<Simplify2<{ a: 1 } & T & { [key in F1["name"]]: F1["type"] }>>
  // select<F1 extends Column, R extends Simplify<T & Row<F1>>>(f1: F1): SelectFrom<R>
  select<F1 extends Column, R extends T & CtoR<F1>>(f1: F1): SelectFrom<{ [key in keyof R]: R[key] }>
  val: T
}


const tuple1 = <T extends any[]>(...args: T): typeof args => args

function tuple2<T extends any[]>(...args: T): T {
  return args;
}

const x = tuple1(1,2,3)
const y = tuple(1,2,3)