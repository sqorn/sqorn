"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
sq.from("")
    .where({});
// .extend(sq.from(""));
var r = sq
    .from("")
    .where({});
// .extend(sq.insert());
var from = sq.from("");
var where = sq.where({});
var whereFrom = sq.from("").where({});
var limit = sq.limit(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
var Animals;
(function (Animals) {
    Animals[Animals["cat"] = 1] = "cat";
    Animals[Animals["dog"] = 2] = "dog";
    Animals[Animals["rat"] = 4] = "rat";
})(Animals || (Animals = {}));
function isCat(a) {
    return (a.type & Animals.cat);
}
if (isCat(animal)) {
    animal.meow();
}
// function isExecutable<T extends Keys>(a: Query<T>): a is (Query<T | X> & Execute<T | X>) {
//   return true
// }
function isExecutable(a) {
    return true;
}
var templateObject_1;
// type x = typeof from;
// if (from.hasOwnProperty("all")) {
//   f;
// }
// if (where.all) {
// }
// const y = b ? from : where;
// if (isExecutable(y)) {
//   y.all;
// }
// const z = b ? from : limit;
// if (z.hasOwnProperty("all")) {
//   z.al;
// }
