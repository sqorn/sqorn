export interface ExpressionBuilder {
  e: NewExpression
}

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
type CompatibleArray<T extends Types> = Compatible<T>[] | null | UnknownExpression | ArrayExpression
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
  // logical
  and: T extends 'new' ? And : AndChain
  or: T extends 'new' ? Or : OrChain
  not: T extends 'new' ? Not : BooleanExpression
  // comparison
  isTrue: T extends 'new' ? IsTrue : BooleanExpression
  isNotTrue: T extends 'new' ? IsNotTrue : BooleanExpression
  isFalse: T extends 'new' ? IsFalse : BooleanExpression
  isNotFalse: T extends 'new' ? IsNotFalse : BooleanExpression
  isUnknown: T extends 'new' ? IsUnknown : BooleanExpression
  isNotUnknown: T extends 'new' ? IsNotUnknown : BooleanExpression
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

interface IsTrue {
  (arg1: Arg): BooleanExpression
}
interface IsNotTrue {
  (arg1: Arg): BooleanExpression
}
interface IsFalse {
  (arg1: Arg): BooleanExpression
}
interface IsNotFalse {
  (arg1: Arg): BooleanExpression
}
interface IsUnknown {
  (arg1: BooleanArgument): BooleanExpression
}
interface IsNotUnknown {
  (arg1: BooleanArgument): BooleanExpression
}

//
// Comparison Operations
//

interface ComparisonOperations<T extends Types> {
  // binary comparison
  eq: T extends 'new' ? Eq : EqChain<T>
  neq: T extends 'new' ? Neq : NeqChain<T>
  lt: T extends 'new' ? Lt : LtChain<T>
  gt: T extends 'new' ? Gt : GtChain<T>
  lte: T extends 'new' ? Lte : LteChain<T>
  gte: T extends 'new' ? Gte : GteChain<T>
  // misc
  between: T extends 'new' ? Between : BetweenChain1<T>
  notBetween: T extends 'new' ? NotBetween : NotBetweenChain1<T>
  isDistinctFrom: T extends 'new' ? IsDistinctFrom : IsDistinctFromChain<T>
  isNotDistinctFrom: T extends 'new' ? IsNotDistinctFrom : IsNotDistinctFromChain<T>
  isNull: T extends 'new' ? IsNull : BooleanExpression
  isNotNull: T extends 'new' ? IsNotNull : BooleanExpression
  in: T extends 'new' ? In : InChain<T>
  notIn: T extends 'new' ? NotIn : NotInChain<T>
  // quantified any
  eqAny: T extends 'new' ? EqAny : EqAnyChain<T>
  neqAny: T extends 'new' ? NeqAny : NeqAnyChain<T>
  ltAny: T extends 'new' ? LtAny : LtAnyChain<T>
  gtAny: T extends 'new' ? GtAny : GtAnyChain<T>
  lteAny: T extends 'new' ? LteAny : LteAnyChain<T>
  gteAny: T extends 'new' ? GteAny : GteAnyChain<T>
  // quantified all
  eqAll: T extends 'new' ? EqAll : EqAllChain<T>
  neqAll: T extends 'new' ? NeqAll : NeqAllChain<T>
  ltAll: T extends 'new' ? LtAll : LtAllChain<T>
  gtAll: T extends 'new' ? GtAll : GtAllChain<T>
  lteAll: T extends 'new' ? LteAll : LteAllChain<T>
  gteAll: T extends 'new' ? GteAll : GteAllChain<T>
}

interface Eq {
  (text: TemplateStringsArray, ...args: any[]): EqChain<'unknown'>
  <T extends Arg>(arg1: T): EqChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface EqChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Neq {
  (strings: TemplateStringsArray, ...args: any[]): NeqChain<'unknown'>
  <T extends Arg>(arg1: T): NeqChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface NeqChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lt {
  (strings: TemplateStringsArray, ...args: any[]): LtChain<'unknown'>
  <T extends Arg>(arg1: T): LtChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface LtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gt {
  (strings: TemplateStringsArray, ...args: any[]): GtChain<'unknown'>
  <T extends Arg>(arg1: T): GtChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface GtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lte {
  (strings: TemplateStringsArray, ...args: any[]): LteChain<'unknown'>
  <T extends Arg>(arg1: T): LteChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface LteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gte {
  (strings: TemplateStringsArray, ...args: any[]): GteChain<'unknown'>
  <T extends Arg>(arg1: T): GteChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface GteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Between {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain1<'unknown'>
  <T extends Arg>(arg1: T): BetweenChain1<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
}
interface BetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain2<T>
  (arg2: Compatible<T>): BetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
}
interface BetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface NotBetween {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain1<'unknown'>
  <T extends Arg>(arg1: T): NotBetweenChain1<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): NotBetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
}
interface NotBetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain2<T>
  (arg2: Compatible<T>): NotBetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
}
interface NotBetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface IsDistinctFrom {
  (text: TemplateStringsArray, ...args: any[]): IsDistinctFromChain<'unknown'>
  <T extends Arg>(arg1: T): IsDistinctFromChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface IsDistinctFromChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface IsNotDistinctFrom {
  (text: TemplateStringsArray, ...args: any[]): IsNotDistinctFromChain<'unknown'>
  <T extends Arg>(arg1: T): IsNotDistinctFromChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface IsNotDistinctFromChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface IsNull {
  (arg1: Arg): BooleanExpression
}
interface IsNotNull {
  (arg1: Arg): BooleanExpression
}

interface EqAny {
  (text: TemplateStringsArray, ...args: any[]): EqAnyChain<'unknown'>
  <T extends Arg>(arg1: T): EqAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqAny {
  (text: TemplateStringsArray, ...args: any[]): NeqAnyChain<'unknown'>
  <T extends Arg>(arg1: T): NeqAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtAny {
  (text: TemplateStringsArray, ...args: any[]): LtAnyChain<'unknown'>
  <T extends Arg>(arg1: T): LtAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtAny {
  (text: TemplateStringsArray, ...args: any[]): GtAnyChain<'unknown'>
  <T extends Arg>(arg1: T): GtAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteAny {
  (text: TemplateStringsArray, ...args: any[]): LteAnyChain<'unknown'>
  <T extends Arg>(arg1: T): LteAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteAny {
  (text: TemplateStringsArray, ...args: any[]): GteAnyChain<'unknown'>
  <T extends Arg>(arg1: T): GteAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface EqSome {
  (text: TemplateStringsArray, ...args: any[]): EqSomeChain<'unknown'>
  <T extends Arg>(arg1: T): EqSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqSome {
  (text: TemplateStringsArray, ...args: any[]): NeqSomeChain<'unknown'>
  <T extends Arg>(arg1: T): NeqSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtSome {
  (text: TemplateStringsArray, ...args: any[]): LtSomeChain<'unknown'>
  <T extends Arg>(arg1: T): LtSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtSome {
  (text: TemplateStringsArray, ...args: any[]): GtSomeChain<'unknown'>
  <T extends Arg>(arg1: T): GtSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteSome {
  (text: TemplateStringsArray, ...args: any[]): LteSomeChain<'unknown'>
  <T extends Arg>(arg1: T): LteSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteSome {
  (text: TemplateStringsArray, ...args: any[]): GteSomeChain<'unknown'>
  <T extends Arg>(arg1: T): GteSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface EqAll {
  (text: TemplateStringsArray, ...args: any[]): EqAllChain<'unknown'>
  <T extends Arg>(arg1: T): EqAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqAll {
  (text: TemplateStringsArray, ...args: any[]): NeqAllChain<'unknown'>
  <T extends Arg>(arg1: T): NeqAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtAll {
  (text: TemplateStringsArray, ...args: any[]): LtAllChain<'unknown'>
  <T extends Arg>(arg1: T): LtAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtAll {
  (text: TemplateStringsArray, ...args: any[]): GtAllChain<'unknown'>
  <T extends Arg>(arg1: T): GtAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteAll {
  (text: TemplateStringsArray, ...args: any[]): LteAllChain<'unknown'>
  <T extends Arg>(arg1: T): LteAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteAll {
  (text: TemplateStringsArray, ...args: any[]): GteAllChain<'unknown'>
  <T extends Arg>(arg1: T): GteAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: CompatibleArray<Infer<T>>): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<T>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface In {
  (text: TemplateStringsArray, ...args: any[]): InChain<'unknown'>
  <T extends Arg>(arg1: T): InChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface InChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>[]): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotIn {
  (text: TemplateStringsArray, ...args: any[]): NotInChain<'unknown'>
  <T extends Arg>(arg1: T): NotInChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NotInChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>[]): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

//
// Number Operations
//

interface MathOperations<T extends NumberTypes> {
  add: T extends 'new' ? Add : AddChain
  sub: T extends 'new' ? Sub : SubChain
  mul: T extends 'new' ? Mul : MulChain
  div: T extends 'new' ? Div : DivChain
  mod: T extends 'new' ? Mod : ModChain
  exp: T extends 'new' ? Exp : ExpChain
  sqrt: T extends 'new'? Sqrt : NumberExpression
  cbrt: T extends 'new'? Cbrt : NumberExpression
  fact: T extends 'new' ? Fact : NumberExpression
  abs: T extends 'new'? Abs : NumberExpression
}

interface Add {
  (text: TemplateStringsArray, ...args: any[]): AddChain
  (arg1: NumberArgument): AddChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface AddChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Sub {
  (text: TemplateStringsArray, ...args: any[]): SubChain
  (arg1: NumberArgument): SubChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface SubChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Mul {
  (text: TemplateStringsArray, ...args: any[]): MulChain
  (arg1: NumberArgument): MulChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface MulChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Div {
  (text: TemplateStringsArray, ...args: any[]): DivChain
  (arg1: NumberArgument): DivChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface DivChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Mod {
  (text: TemplateStringsArray, ...args: any[]): ModChain
  (arg1: NumberArgument): ModChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface ModChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Exp {
  (text: TemplateStringsArray, ...args: any[]): ExpChain
  (arg1: NumberArgument): ExpChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface ExpChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Sqrt {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Cbrt {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Fact {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Abs {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

//
// String Operations
//

interface StringOperations<T extends StringTypes> {
  like: T extends 'new' ? Like : LikeChain
  notLike: T extends 'new' ? NotLike : NotLikeChain
  // any
  likeAny: T extends 'new' ? LikeAny : LikeAnyChain
  notLikeAny: T extends 'new' ? NotLikeAny : NotLikeAnyChain
  // all
  likeAll: T extends 'new' ? LikeAll : LikeAllChain
  notLikeAll: T extends 'new' ? NotLikeAll : NotLikeAllChain


  concat: T extends 'new' ? Concat : ConcatChain
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
  (arg1: StringArgument): LikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
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
  (arg1: StringArgument): NotLikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
}
interface NotLikeChain {
  (strings: TemplateStringsArray, ...args: any[]): LikeEscape
  (arg2: StringArgument): LikeEscape
}

interface LikeAny {
  (strings: TemplateStringsArray, ...args: any[]): LikeAnyChain
  (arg1: StringArgument): LikeAnyChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface LikeAnyChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LikeAll {
  (strings: TemplateStringsArray, ...args: any[]): LikeAllChain
  (arg1: StringArgument): LikeAllChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface LikeAllChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotLikeAny {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeAnyChain
  (arg1: StringArgument): NotLikeAnyChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface NotLikeAnyChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotLikeAll {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeAllChain
  (arg1: StringArgument): NotLikeAllChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface NotLikeAllChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface SimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): SimilarToChain
  (arg1: StringArgument): SimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
}
interface SimilarToChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: StringArgument): BooleanExpression
}

interface NotSimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): NotSimilarToChain
  (arg1: StringArgument): NotSimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
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
  unnest: T extends 'new' ? Unnest : UnnestChain
  arrayGet: T extends 'new' ? ArrayGet : ArrayGetChain
  arrayAppend: T extends 'new' ? ArrayAppend : ArrayAppendChain
  arrayCat: T extends 'new' ? ArrayCat : ArrayCatChain
}

interface Unnest {
  (text: TemplateStringsArray, ...args: any[]): UnnestChain
  (...args: ArrayArgument[]): UnnestChain
}
interface UnnestChain extends Unnest, TableExpression {}

interface ArrayGet {
  (strings: TemplateStringsArray, ...args: any[]): ArrayGetChain
  (array: ArrayArgument): ArrayGetChain
  (array: ArrayArgument, index: NumberArgument): UnknownExpression
}
interface ArrayGetChain {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  (index: NumberArgument): UnknownExpression
}

interface ArrayAppend {
  (strings: TemplateStringsArray, ...args: any[]): ArrayAppendChain
  (array: ArrayArgument): ArrayAppendChain
  (array: ArrayArgument, element: UnknownArgument): ArrayExpression
}
interface ArrayAppendChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (element: UnknownArgument): ArrayExpression
}

interface ArrayCat {
  (strings: TemplateStringsArray, ...args: any[]): ArrayCatChain
  (array1: ArrayArgument): ArrayCatChain
  (array1: ArrayArgument, array2: ArrayArgument): ArrayExpression
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