import { SQF } from "./sq";

declare let sq: SQF;

sq.from('bo')

sq.from('')

sq.from('bo').where({ age: 1 }).and({ age: 2 }, sq.l`asdf`)

sq('book')({ age: 7 }).and()('id')

sq.return(() => 1)

sq.group({ type: 'grouping sets', args: ['', []] })

sq.order({ using: '', sort: 'asc', by: ''})

sq.from('').join('').on()
sq.from('book')

sq.from('book')
sq('book').cross.join()``.cross.join()``.inner.join()

// declare function isExecutable<T, U extends States<T> | X>
//   (a: T): a is Query<U> & Execute<U> & T;

// declare let sq: Root;
// declare let b: boolean;

// const from = sq.from("");
// const where = sq.where({});
// const limit = sq.limit``
// const fromOrWhere = b ? from : where;

// const arr = [from, where]

// if (where.is('Select')) {

// }
// if (where.is('Execute')) {
//   where.is('Select', 'Delete', 'Insert', 'Execute')
// }

// const x = b ? where : limit

// if (x.can('Execute')) {
//   const dd = x.from('').where({})
// }


// sq.where({}).link('').offset``.group``

// const q = sq.from('book').insert()

// sq.from()

// if (q.can('Execute')) {

// }

// arr.map(q => {
//   if (q.can('Execute')) {
//     q.all()
//   }
// })

// const a = sq.extend(sq.from(''))
// const bd = sq.extend(sq.limit``)

// const jkdj = sq.limit``.extend(sq.insert()).

// if (isExecutable(fromOrWhere)) {
//   fromOrWhere.all()
// }
// if (fromOrWhere.can('Execute')) {
//   fromOrWhere.all() // error, property all does not exist
// }

// enum Animals {
//   cat = 1,
//   dog = 2,
//   rat = 4
// }
// interface Animal {
//   type: Animals.cat | Animals.dog | Animals.rat;
//   isCat(): this is Cat
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

// if (animal.isCat) {
//   animal
// }

// interface mayBeNull {
//   importantValue: number | null;
//   check(): this is checkedCannotBeNull;
// }

// interface checkedCannotBeNull {
//   importantValue: number;
// }

// declare let obj: mayBeNull;

// if (obj.check()) {
//   obj.importantValue
// }