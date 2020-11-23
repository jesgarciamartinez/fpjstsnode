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

/* Generalizando el patrón Smart constructor */

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

/* Restringiendo parámetros de funciones */

const head = <A>(as: Array<A>): A => as[0] // unsound, puede devolver undefined y dar un error en runtime
const head2 = <A>(as: Array<A>): A | undefined => as[0] // sound, los consumidores de head2 tienen que tratar la posibilidad de undefined
const head3 = <A>(as: NonEmptyArray<A>): A => as[0] // sound, obliga a hacer un check de que el array no está vacío antes de llamar a head3
