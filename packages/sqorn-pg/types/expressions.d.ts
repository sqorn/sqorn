type TypeExpressionMap = {
  new: NewExpression
  unknown: UnknownExpression
  boolean: BooleanExpression
  number: NumberExpression
  string: StringExpression
  array: ArrayExpression
  row: RowExpression
  subquery: SubqueryExpression
  json: JSONExpression
}
type TypePrimitiveMap = {
  new: never
  unknown: null
  boolean: boolean
  number: number
  string: string
  array: any[]
  row: never
  subquery: never
  json: null | number | boolean | string | any[] | { [key: string]: any }
}
type TypeInferenceMap = {
  [key in Types]: TypeExpressionMap[key] | TypePrimitiveMap[key]
}
type TypeCompatibilityMap = {
  new: never
  unknown: Arg
  boolean: null | TypeInferenceMap['boolean']
  number: null | TypeInferenceMap['number']
  string: null | TypeInferenceMap['string']
  array: null | TypeInferenceMap['array']
  row: null | TypeInferenceMap['row']
  subquery: TypeInferenceMap['subquery']
  json: null | TypeInferenceMap['json']
}
type Types = keyof TypeExpressionMap
type ExpressionTypes = TypeExpressionMap[Types]
type PrimitiveTypes = TypePrimitiveMap[Types]
type Arg = ExpressionTypes | PrimitiveTypes
type Compatible<T extends Types> = TypeCompatibilityMap[T]
type Infer<T extends Arg> = 
  T extends TypeInferenceMap['new'] ? 'new' :
  T extends TypeInferenceMap['unknown'] ? 'unknown' :
  T extends TypeInferenceMap['boolean'] ? 'boolean' :
  T extends TypeInferenceMap['number'] ? 'number' :
  T extends TypeInferenceMap['string'] ? 'string' :
  T extends TypeInferenceMap['array'] ? 'array' :
  T extends TypeInferenceMap['row'] ? 'row' :
  T extends TypeInferenceMap['subquery'] ? 'subquery' :
  T extends TypeInferenceMap['json'] ? 'json' :
  never
type InferCompatible<T extends Arg> = Compatible<Infer<T>>
type InferExpression<T extends Arg> = TypeExpressionMap[Infer<T>]
type tmp = Infer<SubqueryExpression>
type UnknownArgument = TypeCompatibilityMap['unknown']
type BooleanArgument = TypeCompatibilityMap['boolean']
type NumberArgument = TypeCompatibilityMap['number']
type StringArgument = TypeCompatibilityMap['string']
type ArrayArgument = TypeCompatibilityMap['array']
type RowArgument = TypeCompatibilityMap['row']
type SubqueryArgument = TypeCompatibilityMap['subquery']
type JSONArgument = TypeCompatibilityMap['json']

interface Expression<T extends Types> extends ComparisonOperators<T> {
  type: T
  _build(): string
}

//
// Expressions
//

interface AllOperators<T extends Types> extends
  ValueOperators<T>,
  ArgOperators<T>,
  LogicalOperators<T>,
  NumberOperators<T>,
  StringOperators<T>,
  ArrayOperators<T>,
  RowOperators<T>,
  SubqueryOperators<T> {}

interface NewExpression extends Expression<'new'>,
  AllOperators<'new'> {}

interface UnknownExpression extends Expression<'unknown'>,
  AllOperators<'unknown'> {}

interface BooleanExpression extends Expression<'boolean'>,
  LogicalOperators<'boolean'> {}

interface NumberExpression extends Expression<'number'>,
  NumberOperators<'number'> {}

interface StringExpression extends Expression<'string'>,
  StringOperators<'string'> {}

interface ArrayExpression extends Expression<'array'>,
  ArrayOperators<'array'> {}

interface RowExpression extends Expression<'row'> {}

interface SubqueryExpression extends Expression<'subquery'>,
  SubqueryOperators<'subquery'> {}

interface JSONExpression extends Expression<'json'>,
  JSONOperators<'json'> {}

//
// Operators
//

interface ArgOperators<T extends Types> {
  <T extends Arg>(arg: T): InferExpression<T>
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  // (...args: any): RowExpression
}

interface ValueOperators<T extends Types> {
  unknown: T extends 'new' ? UnknownChain : UnknownExpression
  boolean: T extends 'new' ? BooleanChain : BooleanExpression
  number: T extends 'new' ? NumberChain : NumberExpression
  array: T extends 'new' ? ArrayChain : ArrayExpression
  row: T extends 'new' ? RowChain : RowExpression
  subquery: T extends 'new' ? SubqueryChain : SubqueryExpression
  json: T extends 'new' ? JSONChain : JSONExpression
}

interface UnknownChain {
  (unknown: UnknownArgument): UnknownExpression
}
interface BooleanChain {
  (boolean: BooleanArgument): BooleanExpression
}
interface NumberChain {
  (number: NumberArgument): NumberExpression
}
interface ArrayChain {
  (array: ArrayArgument): ArrayExpression
}
interface RowChain {
  (row: RowArgument): RowExpression
}
interface SubqueryChain {
  (subquery: SubqueryArgument): SubqueryExpression
}
interface JSONChain {
  (json: JSONArgument): JSONExpression
}

//
// Logical Operators
//

interface LogicalOperators<T extends Types> {
  and: T extends 'new' ? And : AndChain
  or: T extends 'new' ? Or : OrChain
  not: T extends 'new' ? Not : BooleanExpression
}

interface And {
  (...args: BooleanArgument[]): AndChain
}
interface AndChain extends And, BooleanExpression {}

interface Or {
  (...args: BooleanArgument[]): OrChain
}
interface OrChain extends Or, BooleanExpression {}

interface Not {
  (arg: BooleanArgument): BooleanExpression
}

//
// Comparison Operators
//

interface ComparisonOperators<T extends Types> {
  // binary
  eq: T extends 'new' ? Eq : EqChain<T>
  neq: T extends 'new' ? Neq : NeqChain<T>
  lt: T extends 'new' ? Lt : LtChain<T>
  gt: T extends 'new' ? Gt : GtChain<T>
  lte: T extends 'new' ? Lte : LteChain<T>
  gte: T extends 'new' ? Gte : GteChain<T>
  // ternary
  between: T extends 'new' ? Between : BetweenChain1<T>
  notBetween: T extends 'new' ? NotBetween : NotBetweenChain1<T>
  // subquery / row  / array
  in: T extends 'new' ? In : InChain<T>
  notIn: T extends 'new' ? NotIn : NotInChain<T>
  any: T extends 'new' ? Any : AnyChain<T>
  some: T extends 'new' ? Some : SomeChain<T>
  all: T extends 'new' ? All : AllChain<T>
}

interface Eq {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): EqChain<Infer<T>>
  (text: TemplateStringsArray, ...args: any[]): EqChain<'unknown'>
}
interface EqChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Neq {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): NeqChain<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): NeqChain<'unknown'>
}
interface NeqChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Lt {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): LtChain<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): LtChain<'unknown'>
}
interface LtChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Gt {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): GtChain<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): GtChain<'unknown'>
}
interface GtChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Lte {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): LteChain<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): LteChain<'unknown'>
}
interface LteChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Gte {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): GteChain<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): GteChain<'unknown'>
}
interface GteChain<T extends Types> {
  (arg2: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface Between {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T): BetweenChain1<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain1<'unknown'>
}
interface BetweenChain1<T extends Types> {
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
  (arg2: Compatible<T>): BetweenChain2<T>
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain2<T>
}
interface BetweenChain2<T extends Types> {
  (arg3: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface NotBetween {
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): NotBetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T): NotBetweenChain1<Infer<T>>
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain1<'unknown'>
}
interface NotBetweenChain1<T extends Types> {
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
  (arg2: Compatible<T>): NotBetweenChain2<T>
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain2<T>
}
interface NotBetweenChain2<T extends Types> {
  (arg3: Compatible<T>): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface In {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): InChain<Infer<T>>
  (text: TemplateStringsArray, ...args: any[]): InChain<'unknown'>
  // Values List
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface InChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // Values List
  (arg2: Compatible<T>[]): BooleanExpression
}

interface NotIn {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): NotInChain<Infer<T>>
  (text: TemplateStringsArray, ...args: any[]): NotInChain<'unknown'>
  // Values List
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface NotInChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // Values List
  (arg2: Compatible<T>[]): BooleanExpression
}

interface Any {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): AnyChain<Infer<T>>
  (text: TemplateStringsArray, ...args: any[]): AnyChain<'unknown'>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression

}
interface AnyChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

interface Some {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): SomeChain<Infer<T>>
  (text: TemplateStringsArray, ...args: Some[]): SomeChain<'unknown'>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface SomeChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: Some[]): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

interface All {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): AllChain<Infer<T>>
  (text: TemplateStringsArray, ...args: All[]): AllChain<'unknown'>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface AllChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: All[]): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

//
// Number Operators
//

interface NumberOperators<T extends Types> {
  add: T extends 'new' ? Add : AddChain
  subtract: T extends 'new' ? Subtract : SubtractChain
  multiply: T extends 'new' ? Multiply : MultiplyChain
  divide: T extends 'new' ? Divide : DivideChain
}

interface Add {
  (...args: NumberArgument[]): AddChain
  (strings: TemplateStringsArray, ...args: any[]): AddChain
}
interface AddChain extends Add, NumberExpression {}

interface Subtract {
  (...args: NumberArgument[]): SubtractChain
  (strings: TemplateStringsArray, ...args: any[]): SubtractChain
}
interface SubtractChain extends Subtract, NumberExpression {}

interface Multiply {
  (...args: NumberArgument[]): MultiplyChain
  (strings: TemplateStringsArray, ...args: any[]): MultiplyChain
}
interface MultiplyChain extends Multiply, NumberExpression {}

interface Divide {
  (...args: NumberArgument[]): DivideChain
  (strings: TemplateStringsArray, ...args: any[]): DivideChain
}
interface DivideChain extends Divide, NumberExpression {}

//
// String Operators
//

interface StringOperators<T extends Types> {
  like: T extends 'new' ? Like : LikeChain
  notLike: T extends 'new' ? NotLike : NotLikeChain
}

interface Like {
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
  (arg1: StringArgument): LikeChain
  (strings: TemplateStringsArray, ...args: any[]): LikeChain
}
interface LikeChain {
  (arg2: StringArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface NotLike {
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
  (arg1: StringArgument): NotLikeChain
  (strings: TemplateStringsArray, ...args: any[]): NotLikeChain
}
interface NotLikeChain {
  (arg2: StringArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

//
// Array Operators
//

interface ArrayOperators<T extends Types> {
  unnest: T extends 'new' ? Unnest : SubqueryExpression
  arrayGet: T extends 'new' ? ArrayGet : ArrayGetChain
  arrayAppend: T extends 'new' ? ArrayAppend : ArrayAppendChain
  arrayCat: T extends 'new' ? ArrayCat : ArrayCatChain
}

interface Unnest {
  (arg: ArrayArgument): SubqueryExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface ArrayGet {
  (array: ArrayArgument, index: NumberArgument): UnknownExpression
  (array: ArrayArgument): ArrayGetChain
  (strings: TemplateStringsArray, ...args: any[]): ArrayGetChain
}
interface ArrayGetChain {
  (index: NumberArgument): UnknownExpression
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
}

interface ArrayAppend {
  (array: ArrayArgument, element: UnknownArgument): ArrayExpression
  (array: ArrayArgument): ArrayAppendChain
  (strings: TemplateStringsArray, ...args: any[]): ArrayAppendChain
}
interface ArrayAppendChain {
  (element: UnknownArgument): ArrayExpression
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
}

interface ArrayCat {
  (array1: ArrayArgument, array2: ArrayArgument): ArrayExpression
  (array1: ArrayArgument): ArrayCatChain
  (strings: TemplateStringsArray, ...args: any[]): ArrayCatChain
}
interface ArrayCatChain {
  (array2: ArrayArgument): ArrayExpression
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
}

//
// Row Operators
//
interface RowOperators<T extends Types> {}

//
// Subquery Operators
//

interface SubqueryOperators<T extends Types> {
  exists: T extends 'new' ? Exists : BooleanExpression
  notExists: T extends 'new' ? NotExists : BooleanExpression
}

interface Exists {
  (arg: SubqueryArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface NotExists {
  (arg: SubqueryArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

//
// JSON Operators
//

interface JSONOperators<T extends Types> {}