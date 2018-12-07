type TypeExpressionMap = {
  new: NewExpression
  unknown: UnknownExpression
  boolean: BooleanExpression
  number: NumberExpression
  row: RowExpression
  subquery: SubqueryExpression
}
type TypePrimitiveMap = {
  new: never
  unknown: null
  boolean: boolean
  number: number
  row: never
  subquery: never
}
type TypeInferenceMap = {
  [key in Types]: TypeExpressionMap[key] | TypePrimitiveMap[key]
}
type TypeCompatibilityMap = {
  new: never
  unknown: Arg
  boolean: null | TypeInferenceMap['boolean']
  number: null | TypeInferenceMap['number']
  row: null | TypeInferenceMap['row']
  subquery: TypeInferenceMap['subquery']
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
  T extends TypeInferenceMap['row'] ? 'row' :
  T extends TypeInferenceMap['subquery'] ? 'subquery' :
  never
type InferCompatible<T extends Arg> = Compatible<Infer<T>>
type InferExpression<T extends Arg> = TypeExpressionMap[Infer<T>]
type tmp = Infer<SubqueryExpression>
type UnknownArgument = TypeCompatibilityMap['unknown']
type BooleanArgument = TypeCompatibilityMap['boolean']
type NumberArgument = TypeCompatibilityMap['number']
type RowArgument = TypeCompatibilityMap['row']
type SubqueryArgument = TypeCompatibilityMap['subquery']

interface Expression {
  type: Types
  _build(): string
}

//
// Expressions
//

interface AnyExpression<T extends Types> extends
  Expression,
  ArgOperators<T>,
  LogicalOperators<T>,
  ComparisonOperators<T>,
  NumberOperators<T>,
  SubqueryOperators<T> { type: T }

interface NewExpression extends AnyExpression<'new'> {}

interface UnknownExpression extends AnyExpression<'unknown'> {}

interface BooleanExpression extends
  Expression,
  LogicalOperators<'boolean'>,
  ComparisonOperators<'boolean'> { type: 'boolean' }

interface NumberExpression extends
  Expression,
  NumberOperators<'number'>,
  ComparisonOperators<'number'> { type: 'number' }

interface RowExpression extends
  Expression { type: 'row' }

interface SubqueryExpression extends
  Expression,
  SubqueryOperators<'subquery'> { type: 'subquery' }

//
// Operators
//

interface ArgOperators<T extends Types> {
  <T extends Arg>(arg: T): InferExpression<T>
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  // (...args: any): RowExpression
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
  // Values List
}
interface AnyChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  // Values List
}

interface Some {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): SomeChain<Infer<T>>
  (text: TemplateStringsArray, ...args: Some[]): SomeChain<'unknown'>
  // Values List
}
interface SomeChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: Some[]): BooleanExpression
  // Values List
}

interface All {
  // Subquery
  <T extends Arg>(arg1: T, arg2: SubqueryArgument): BooleanExpression
  <T extends Arg>(arg1: T): AllChain<Infer<T>>
  (text: TemplateStringsArray, ...args: All[]): AllChain<'unknown'>
  // Values List
}
interface AllChain<T extends Types> {
  // Subquery
  (arg2: SubqueryArgument): BooleanExpression
  (text: TemplateStringsArray, ...args: All[]): BooleanExpression
  // Values List
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
// Subquery Operators
//

interface SubqueryOperators<T extends Types> {
  exists: T extends 'new' ? ExistsSubquery : BooleanExpression
  notExists: T extends 'new' ? NotExistsSubquery : BooleanExpression
}

interface ExistsSubquery {
  (arg: SubqueryArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}

interface NotExistsSubquery {
  (arg: SubqueryArgument): BooleanExpression
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
}
