import { Root, Any, Execute, States, Query, Keys, X } from './queries'

declare let sq: Root;
declare let b: boolean;

sq.from('').where({}).extend(sq.from(''))
const r = sq.from('').where({}).extend(sq.insert())

const from = sq.from('')
const where = sq.where({})
const whereFrom = sq.from('').where({})
const limit = sq.limit``

type A = { a: 1 }
type B = { b: 1 }
type C = { c: 1 }
type t1 = (1 | 2) & (2 | 3)
type t2 = ((A & B) | (B & C))

declare let a1: A, b1: B, c1: C;

enum Animals {
  cat = 1,
  dog = 2,
  rat = 4
}

interface Animal {
  type: Animals.cat | Animals.dog | Animals.rat
}

interface Cat extends Animal {
  type: Animals.cat
  meow()
}

interface Dog extends Animal {
  type: Animals.dog
  bark()
}

interface Rat extends Animal {
  type: Animals.rat
  squeek()
}

declare let animal: Cat | Dog | Rat

function isCat(a: Animal): a is Cat {
  return (a.type & Animals.cat) as unknown as boolean
}

if (isCat(animal)) { 
  animal.meow()
}

// function isExecutable<T extends Keys>(a: Query<T>): a is (Query<T | X> & Execute<T | X>) {
//   return true
// }

type x = typeof from;
if (from.hasOwnProperty('all')) {
  f
}
if (where.all) {

}
const y = b ? from : where
if (isExecutable(y)) {
  y.all
}
const z = b ? from : limit


if (z.hasOwnProperty('all')) {
  z.al
}