import { Root, Execute, States, Query, X } from "./queries";

declare function isExecutable<T, U extends States<T> | X>
  (a: T): a is Query<U> & Execute<U> & T;

declare let sq: Root;
declare let b: boolean;

const from = sq.from("");
const where = sq.where({});
const limit = sq.limit``
const fromOrWhere = b ? from : where;

const arr = [from, where]

if (where.is('Select')) {

}
if (where.is('Execute')) {
  where.is('Select', 'Delete', 'Insert', 'Execute')
}

const x = b ? where : limit

if (x.can('Execute')) {
  const dd = x.from('').where({})
}

arr.map(q => {
  if (q.can('Execute')) {
    q.all()
  }
})

if (isExecutable(fromOrWhere)) {
  fromOrWhere.all()
}
if (fromOrWhere.can('Execute')) {
  fromOrWhere.all() // error, property all does not exist
}

enum Animals {
  cat = 1,
  dog = 2,
  rat = 4
}
interface Animal {
  type: Animals.cat | Animals.dog | Animals.rat;
  isCat(): this is Cat
}
interface Cat extends Animal {
  type: Animals.cat;
  meow();
}
interface Dog extends Animal {
  type: Animals.dog;
  bark();
}
interface Rat extends Animal {
  type: Animals.rat;
  squeek();
}
declare let animal: Cat | Dog | Rat;
function isCat(a: Animal): a is Cat {
  return ((a.type & Animals.cat) as unknown) as boolean;
}

if (isCat(animal)) {
  animal.meow();
}

if (animal.isCat) {
  animal
}

interface mayBeNull {
  importantValue: number | null;
  check(): this is checkedCannotBeNull;
}

interface checkedCannotBeNull {
  importantValue: number;
}

declare let obj: mayBeNull;

if (obj.check()) {
  obj.importantValue
}