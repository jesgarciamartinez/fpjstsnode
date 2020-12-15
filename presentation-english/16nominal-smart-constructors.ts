/**
 * TS is a structural type system, but sometimes we want to be able to differentiate two types with the same structure.
 */

/* First: intersection types*/

type USD = number & { readonly _brand: unique symbol } // "Abusing" an intersection type
// type USD = number & { readonly _brand?: unique symbol } // allows casting number

type EUR = number & { readonly _brand: unique symbol }

let dollars: USD = 3 as USD
let euros: EUR = 3 as EUR

euros = dollars

type Branded<A, B> = A & { readonly _brand: B }
type CastableBranded<A, B> = A & { readonly _brand?: B }

type Pound = Branded<number, 'Pound'> // Less safe, could have repeated strings
type CastablePound = CastableBranded<number, 'CastablePound'>

const pound: Pound = 3
const castablePound: CastablePound = 3

/* Smart constructors */

declare const people: Array<Person>

export type Person = {
  name: string
  age: number
}
type Predicate<A> = (_: A) => boolean

type Adult = Person & { readonly _tag: unique symbol }
// const isAdult: Predicate<Person> = person => person.age > 18
const isAdult = (x: Person): x is Adult => x.age > 18 // User-defined type guard
const makeAdult = (x: Person): Adult | null => (isAdult(x) ? x : null)

function filter<A, B extends A>(f: (_: A) => _ is B, as: A[]): B[] {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    const keep = f(a)
    if (keep) {
      result.push(a as B)
    }
  }
  return result
}

const adults3 = filter(isAdult, people)

function narrow<A, B extends A>(f: (_: A) => B | null, as: A[]): B[] {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    const keep = f(a)
    if (keep) {
      result.push(keep)
    }
  }
  return result
}

const adults = narrow(makeAdult, people)

/* More general smart constructors */

type Nullable<T> = T | null
type Refinement<P, T extends P> = (x: P) => x is T
type SmartConstructor<P, T> = (x: P) => Nullable<T>

const refineWith = <P, T extends P>(f: Refinement<P, T>) => (
  x: P,
): Nullable<T> => (f(x) ? x : null)

const refineWith2: <P, T extends P>(
  _: Refinement<P, T>,
) => SmartConstructor<P, T> = /*
 */ f => x => (f(x) ? x : null)

const makeAdult2 = refineWith(isAdult)
const adults2 = narrow(makeAdult2, people)

/* Dealing with unsoundness
  See article: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
*/

const head = <A>(as: Array<A>): A => as[0] // unsound, can return undefined and error out in runtime
const head2 = <A>(as: Array<A>): A | undefined => as[0] // sound, consumers of head2 must deal with undefined
const head3 = <A>(as: NonEmptyArray<A>): A => as[0] // sound, requires checking that the array is not empty before calling head3
