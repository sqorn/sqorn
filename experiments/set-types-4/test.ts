import { Root, Any, Execute, States, Query, X } from "./queries";

declare function isExecutable<T extends Any<any>, U extends States<T> | X>
  (a: T): a is Query<U> & Execute<U> & T;

declare let sq: Root;
declare let b: boolean;

const from = sq.from("");
const where = sq.where({});
const fromOrWhere = b ? from : where;

if (isExecutable(fromOrWhere)) {
  fromOrWhere.all()
}
if (fromOrWhere.isExecutable) {
  fromOrWhere.all() // property all does not exist on type
}

// enum Animals {
//   cat = 1,
//   dog = 2,
//   rat = 4
// }
// interface Animal {
//   type: Animals.cat | Animals.dog | Animals.rat;
// }
// interface Cat extends Animal {
//   type: Animals.cat;
//   meow();
// }
// interface Dog extends Animal {
//   type: Animals.dog;
//   bark();
// }
// interface Rat extends Animal {
//   type: Animals.rat;
//   squeek();
// }
// declare let animal: Cat | Dog | Rat;
// function isCat(a: Animal): a is Cat {
//   return ((a.type & Animals.cat) as unknown) as boolean;
// }

// if (isCat(animal)) {
//   animal.meow();
// }