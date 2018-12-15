type TypeExpressionMap = {
  new: NewExpression
  unknown: UnknownExpression
  boolean: BooleanExpression
  number: NumberExpression
  string: StringExpression
  array: ArrayExpression
  json: JSONExpression
  row: RowExpression
  table: TableExpression
}
type TypePrimitiveMap = {
  new: never
  unknown: null
  boolean: boolean
  number: number
  string: string
  array: any[]
  json: null | number | boolean | string | any[] | { [key: string]: any }
  row: never
  table: never
}
type TypeInferenceMap = {
  [key in Types]: TypeExpressionMap[key] | TypePrimitiveMap[key]
}
type InferOrUnknown<T extends Types> = null | UnknownExpression | TypeInferenceMap[T]
type TypeCompatibilityMap = {
  new: never
  unknown: Arg
  boolean: InferOrUnknown<'boolean'>
  number: InferOrUnknown<'number'>
  string: InferOrUnknown<'string'>
  array: InferOrUnknown<'array'>
  json: InferOrUnknown<'json'>
  row: InferOrUnknown<'row'>
  table: TypeInferenceMap['table']
}
type Types = keyof TypeExpressionMap
type ExpressionTypes = TypeExpressionMap[Types]
type PrimitiveTypes = TypePrimitiveMap[Types]
type ArgTypes = Exclude<Types, 'new'>
type Arg = TypeExpressionMap[ArgTypes] | PrimitiveTypes
type Compatible<T extends Types> = TypeCompatibilityMap[T]
type Infer<T extends Arg> = 
  T extends TypeInferenceMap['new'] ? 'new' :
  T extends TypeInferenceMap['unknown'] ? 'unknown' :
  T extends TypeInferenceMap['boolean'] ? 'boolean' :
  T extends TypeInferenceMap['number'] ? 'number' :
  T extends TypeInferenceMap['string'] ? 'string' :
  T extends TypeInferenceMap['array'] ? 'array' :
  T extends TypeInferenceMap['row'] ? 'row' :
  T extends TypeInferenceMap['table'] ? 'table' :
  T extends TypeInferenceMap['json'] ? 'json' :
  never // json must be last due to structural typing
type InferCompatible<T extends Arg> = Compatible<Infer<T>>
type UnknownArgument = TypeCompatibilityMap['unknown']
type BooleanArgument = TypeCompatibilityMap['boolean']
type NumberArgument = TypeCompatibilityMap['number']
type StringArgument = TypeCompatibilityMap['string']
type ArrayArgument = TypeCompatibilityMap['array']
type RowArgument = TypeCompatibilityMap['row']
type TableArgument = TypeCompatibilityMap['table']
type JSONArgument = TypeCompatibilityMap['json']
type CompatibleTypes<T extends Types> = T | 'new' | 'unknown'
type BooleanTypes = CompatibleTypes<'boolean'>
type NumberTypes = CompatibleTypes<'number'>
type StringTypes = CompatibleTypes<'string'>
type ArrayTypes = CompatibleTypes<'array'>
type RowTypes = CompatibleTypes<'row'>
type TableTypes = CompatibleTypes<'table'>
type JSONTypes = CompatibleTypes<'json'>


interface Expression<T extends Types> extends ComparisonOperations<T> {
  type: T
  _build(): string
}

//
// Expressions
//

interface AllOperations<T extends 'new' | 'unknown'> extends
  ValueOperations<T>,
  ArgOperations,
  LogicalOperations<T>,
  MathOperations<T>,
  StringOperations<T>,
  ArrayOperations<T>,
  RowOperations<T>,
  TableOperations<T> {}

interface NewExpression extends Expression<'new'>,
  AllOperations<'new'> {}

interface UnknownExpression extends Expression<'unknown'>,
  AllOperations<'unknown'> {}

interface BooleanExpression extends Expression<'boolean'>,
  LogicalOperations<'boolean'> {}

interface NumberExpression extends Expression<'number'>,
  MathOperations<'number'> {}

interface StringExpression extends Expression<'string'>,
  StringOperations<'string'> {}

interface ArrayExpression extends Expression<'array'>,
  ArrayOperations<'array'> {}

interface RowExpression extends Expression<'row'> {}

interface TableExpression extends Expression<'table'>,
  TableOperations<'table'>,
  ValueOperations<'table'> {}

interface JSONExpression extends Expression<'json'>,
  JSONOperations<'json'> {}

//
// Operations
//

interface ArgOperations {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  <T extends Arg>(arg: T): TypeArgChainMap[Infer<T>]
  (...arg: Arg[]): RowExpression
}

type TypeArgChainMap = {
  unknown: ArgUnknownChain
  boolean: ArgBooleanChain
  number: ArgNumberChain
  string: ArgStringChain
  array: ArgArrayChain
  json: ArgJSONChain
  row: ArgRowChain
  table: ArgTableChain
}
interface ArgChain {
  (strings: TemplateStringsArray, ...args: any[]): RowExpression
  (...arg: Arg[]): RowExpression
}
interface ArgUnknownChain extends ArgChain, UnknownExpression {}
interface ArgBooleanChain extends ArgChain, BooleanExpression {}
interface ArgNumberChain extends ArgChain, NumberExpression {}
interface ArgStringChain extends ArgChain, StringExpression {}
interface ArgArrayChain extends ArgChain, ArrayExpression {}
interface ArgJSONChain extends ArgChain, JSONExpression {}
interface ArgRowChain extends ArgChain, RowExpression {}
interface ArgTableChain extends ArgChain, TableExpression {}


interface ValueOperations<T extends Types> {
  unknown: T extends 'new' ? UnknownChain : UnknownExpression
  boolean: T extends 'new' ? BooleanChain : BooleanExpression
  number: T extends 'new' ? NumberChain : NumberExpression
  string: T extends 'new' ? StringChain : StringExpression
  array: T extends 'new' ? ArrayChain : ArrayExpression
  json: T extends 'new' ? JSONChain : JSONExpression
  row: T extends 'new' ? RowChain : RowExpression
  table: T extends 'new' ? TableChain : TableExpression
}

interface UnknownChain {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  (unknown: UnknownArgument): UnknownExpression
}
interface BooleanChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (boolean: BooleanArgument): BooleanExpression
}
interface NumberChain {
  (strings: TemplateStringsArray, ...args: any[]): NumberExpression
  (number: NumberArgument): NumberExpression
}
interface StringChain {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (string: StringArgument): StringExpression
}
interface ArrayChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (array: ArrayArgument): ArrayExpression
}
interface JSONChain {
  (strings: TemplateStringsArray, ...args: any[]): JSONExpression
  (json: JSONArgument): JSONExpression
}
interface RowChain {
  (strings: TemplateStringsArray, ...args: any[]): RowExpression
  (row: RowArgument): RowExpression
  (...arg: Arg[]): RowExpression
}
interface TableChain {
  (strings: TemplateStringsArray, ...args: any[]): TableExpression
  (table: TableArgument): TableExpression
}

//
// Logical Operations
//

interface LogicalOperations<T extends BooleanTypes> {
  and: T extends 'new' ? And : AndChain
  or: T extends 'new' ? Or : OrChain
  not: T extends 'new' ? Not : BooleanExpression
}

interface And {
  (text: TemplateStringsArray, ...args: any[]): AndChain
  (...args: BooleanArgument[]): AndChain

}
interface AndChain extends And, BooleanExpression {}

interface Or {
  (text: TemplateStringsArray, ...args: any[]): OrChain
  (...args: BooleanArgument[]): OrChain
}
interface OrChain extends Or, BooleanExpression {}

interface Not {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: BooleanArgument): BooleanExpression
}

//
// Comparison Operations
//

interface ComparisonOperations<T extends Types> {
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
  // table / row  / array
  in: T extends 'new' ? In : InChain<T>
  notIn: T extends 'new' ? NotIn : NotInChain<T>
  any: T extends 'new' ? Any : AnyChain<T>
  some: T extends 'new' ? Some : SomeChain<T>
  all: T extends 'new' ? All : AllChain<T>
}

interface Eq {
  (text: TemplateStringsArray, ...args: any[]): EqChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): EqChain<Infer<T>>
}
interface EqChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Neq {
  (strings: TemplateStringsArray, ...args: any[]): NeqChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): NeqChain<Infer<T>>
}
interface NeqChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lt {
  (strings: TemplateStringsArray, ...args: any[]): LtChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): LtChain<Infer<T>>
}
interface LtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gt {
  (strings: TemplateStringsArray, ...args: any[]): GtChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): GtChain<Infer<T>>
}
interface GtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lte {
  (strings: TemplateStringsArray, ...args: any[]): LteChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): LteChain<Infer<T>>
}
interface LteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gte {
  (strings: TemplateStringsArray, ...args: any[]): GteChain<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T): GteChain<Infer<T>>
}
interface GteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Between {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain1<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T): BetweenChain1<Infer<T>>
}
interface BetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
  (arg2: Compatible<T>): BetweenChain2<T>
}
interface BetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface NotBetween {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain1<'unknown'>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): NotBetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T): NotBetweenChain1<Infer<T>>
}
interface NotBetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
  (arg2: Compatible<T>): NotBetweenChain2<T>
}
interface NotBetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface In {
  (text: TemplateStringsArray, ...args: any[]): InChain<'unknown'>
  // table
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
  <T extends Arg>(arg1: T): InChain<Infer<T>>
  // Values List
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface InChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // table
  (arg2: TableArgument): BooleanExpression
  // Values List
  (arg2: Compatible<T>[]): BooleanExpression
}

interface NotIn {
  (text: TemplateStringsArray, ...args: any[]): NotInChain<'unknown'>
  // table
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
  <T extends Arg>(arg1: T): NotInChain<Infer<T>>
  // Values List
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface NotInChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // table
  (arg2: TableArgument): BooleanExpression
  // Values List
  (arg2: Compatible<T>[]): BooleanExpression
}

interface Any {
  (text: TemplateStringsArray, ...args: any[]): AnyChain<'unknown'>
  // table
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
  <T extends Arg>(arg1: T): AnyChain<Infer<T>>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression

}
interface AnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // table
  (arg2: TableArgument): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

interface Some {
  (text: TemplateStringsArray, ...args: Some[]): SomeChain<'unknown'>
  // table
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
  <T extends Arg>(arg1: T): SomeChain<Infer<T>>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface SomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: Some[]): BooleanExpression
  // table
  (arg2: TableArgument): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

interface All {
  (text: TemplateStringsArray, ...args: All[]): AllChain<'unknown'>
  // table
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
  <T extends Arg>(arg1: T): AllChain<Infer<T>>
  // Array
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
}
interface AllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: All[]): BooleanExpression
  // table
  (arg2: TableArgument): BooleanExpression
  // Array
  (arg2: Compatible<T>[]): BooleanExpression
}

//
// Number Operations
//

interface MathOperations<T extends NumberTypes> {
  add: T extends 'new' ? Add : AddChain
  subtract: T extends 'new' ? Subtract : SubtractChain
  multiply: T extends 'new' ? Multiply : MultiplyChain
  divide: T extends 'new' ? Divide : DivideChain
}

interface Add {
  (strings: TemplateStringsArray, ...args: any[]): AddChain
  (...args: NumberArgument[]): AddChain
}
interface AddChain extends Add, NumberExpression {}

interface Subtract {
  (strings: TemplateStringsArray, ...args: any[]): SubtractChain
  (...args: NumberArgument[]): SubtractChain
}
interface SubtractChain extends Subtract, NumberExpression {}

interface Multiply {
  (strings: TemplateStringsArray, ...args: any[]): MultiplyChain
  (...args: NumberArgument[]): MultiplyChain
}
interface MultiplyChain extends Multiply, NumberExpression {}

interface Divide {
  (strings: TemplateStringsArray, ...args: any[]): DivideChain
  (...args: NumberArgument[]): DivideChain
}
interface DivideChain extends Divide, NumberExpression {}

//
// String Operations
//

interface StringOperations<T extends StringTypes> {
  concat: T extends 'new' ? Concat : ConcatChain
  like: T extends 'new' ? Like : LikeChain
  notLike: T extends 'new' ? NotLike : NotLikeChain
  similarTo: T extends 'new' ? SimilarTo : SimilarToChain
  notSimilarTo: T extends 'new' ? NotSimilarTo : NotSimilarToChain
  lower: T extends 'new' ? Lower : StringExpression
  upper: T extends 'new' ? Upper : StringExpression
}

interface Concat {
  (strings: TemplateStringsArray, ...args: any[]): ConcatChain
  (...args: StringArgument[]): ConcatChain
}
interface ConcatChain extends Concat, StringExpression {}

interface Like {
  (strings: TemplateStringsArray, ...args: any[]): LikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
  (arg1: StringArgument): LikeChain
}
interface LikeChain {
  (strings: TemplateStringsArray, ...args: any[]): LikeEscape
  (arg2: StringArgument): LikeEscape
}

interface LikeEscape extends BooleanExpression {
  escape(strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  escape(character: StringArgument): BooleanExpression
}

interface NotLike {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
  (arg1: StringArgument): NotLikeChain
}
interface NotLikeChain {
  (strings: TemplateStringsArray, ...args: any[]): LikeEscape
  (arg2: StringArgument): LikeEscape
}

interface SimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): SimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
  (arg1: StringArgument): SimilarToChain
}
interface SimilarToChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: StringArgument): BooleanExpression
}

interface NotSimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): NotSimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
  (arg1: StringArgument): NotSimilarToChain
}
interface NotSimilarToChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: StringArgument): BooleanExpression
}

interface Lower {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (arg: StringArgument): StringExpression
}

interface Upper {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (arg: StringArgument): StringExpression
}

//
// Array Operations
//

interface ArrayOperations<T extends ArrayTypes> {
  unnest: T extends 'new' ? Unnest : TableExpression
  arrayGet: T extends 'new' ? ArrayGet : ArrayGetChain
  arrayAppend: T extends 'new' ? ArrayAppend : ArrayAppendChain
  arrayCat: T extends 'new' ? ArrayCat : ArrayCatChain
}

interface Unnest {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: ArrayArgument): TableExpression
}

interface ArrayGet {
  (strings: TemplateStringsArray, ...args: any[]): ArrayGetChain
  (array: ArrayArgument, index: NumberArgument): UnknownExpression
  (array: ArrayArgument): ArrayGetChain
}
interface ArrayGetChain {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  (index: NumberArgument): UnknownExpression
}

interface ArrayAppend {
  (strings: TemplateStringsArray, ...args: any[]): ArrayAppendChain
  (array: ArrayArgument, element: UnknownArgument): ArrayExpression
  (array: ArrayArgument): ArrayAppendChain
}
interface ArrayAppendChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (element: UnknownArgument): ArrayExpression
}

interface ArrayCat {
  (strings: TemplateStringsArray, ...args: any[]): ArrayCatChain
  (array1: ArrayArgument, array2: ArrayArgument): ArrayExpression
  (array1: ArrayArgument): ArrayCatChain
}
interface ArrayCatChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (array2: ArrayArgument): ArrayExpression
}

//
// Row Operations
//
interface RowOperations<T extends RowTypes> {

}

//
// table Operations
//

interface TableOperations<T extends TableTypes> {
  exists: T extends 'new' ? Exists : BooleanExpression
  notExists: T extends 'new' ? NotExists : BooleanExpression
}

interface Exists {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: TableArgument): BooleanExpression
}

interface NotExists {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: TableArgument): BooleanExpression
}

//
// JSON Operations
//

interface JSONOperations<T extends JSONTypes> {}