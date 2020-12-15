/**
 * TS tiene un sistema de tipos estructural, pero a veces queremos diferenciar dos tipos con la misma estructura.
 */

/* Primero: intersection types */

type USD = number & { readonly _brand: unique symbol } //"Abusando" un intersection type
// type USD = number & { readonly _brand?: unique symbol } // permite casting de number

type EUR = number & { readonly _brand: unique symbol } //"Abusando" un intersection type

let dollars: USD = 3 as USD
let euros: EUR = 3 as EUR

euros = dollars

type Branded<A, B> = A & { readonly _brand: B }
type CastableBranded<A, B> = A & { readonly _brand?: B }

type Pound = Branded<number, 'Pound'> // Menos seguro, puede haber strings repetidas
type CastablePound = CastableBranded<number, 'CastablePound'>

const pound: Pound = 3
const castablePound: CastablePound = 3

/* Patrón Smart constructor */

declare const people: Array<Person>

export type Person = {
  name: string
  age: number
}
type Predicate<A> = (_: A) => boolean

type Adult = Person & { readonly _tag: unique symbol }
// const isAdult: Predicate<Person> = person => person.age > 18
const isAdult = (x: Person): x is Adult => x.age > 18 // User-defined type guard
const makeAdult = (x: Person): Adult => {
  if (!isAdult(x)) {
    throw new Error(`${x} is not an Adult`)
  } else {
    return x
  }
}

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
type CanThrow<T> = T

function narrow<A, B extends A>(f: (_: A) => CanThrow<B>, as: A[]): B[] {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    let keep: B | false
    try {
      keep = f(a)
    } catch (error) {
      keep = false
    }

    if (keep) {
      result.push(keep)
    }
  }
  return result
}

const adults = narrow(makeAdult, people)

/* Generalizando el patrón Smart constructor */

type Refinement<P, T extends P> = (x: P) => x is T
type SmartConstructor<P, T> = (x: P) => CanThrow<T>
const throwError = (e: string) => {
  throw new Error(e)
}

const refineWith: <P, T extends P>(
  f: Refinement<P, T>,
  e: (_: P) => string,
) => SmartConstructor<P, T> = /*
 */ (f, e) => x => (f(x) ? x : throwError(e(x)))

const makeAdult2 = refineWith(isAdult, x => `${x} is not an adult`)

type NonZeroNumber = number & { readonly _brand: unique symbol }
const isNonZero = (x: number): x is NonZeroNumber => x !== 0
const makeNonZero = refineWith(isNonZero, n => `${n} is 0`)

const adults2 = narrow(makeAdult2, people)

/* Restringiendo parámetros de funciones */

const head = <A>(as: Array<A>): A => as[0] // unsound, puede devolver undefined y dar un error en runtime

const head2 = <A>(as: Array<A>): A | undefined => as[0] // sound, los consumidores de head2 tienen que tratar la posibilidad de undefined

type NonEmptyArray<A> = Array<A> & { readonly _brand: unique symbol }
const isNonEmpty = <A>(x: Array<A>): x is NonEmptyArray<A> => x.length > 0
const makeNonEmpty = <A>(x: Array<A>): NonEmptyArray<A> =>
  isNonEmpty(x) ? x : throwError(`${x} is an empty array`)

const head3 = <A>(as: NonEmptyArray<A>): A => as[0] // sound, obliga a hacer un check de que el array no está vacío antes de llamar a head3

const array = [1, 2, 3]

let maybeNonEmptyArray
try {
  maybeNonEmptyArray = makeNonEmpty(array)
} catch (error) {
  //handle error
}
if (maybeNonEmptyArray) {
  head3(maybeNonEmptyArray) //✅
  head3(array) //❌
}

/* ¿Podríamos evitar lanzar errores? */
