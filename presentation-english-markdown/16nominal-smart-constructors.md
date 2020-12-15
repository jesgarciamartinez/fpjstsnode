# Re-introducing nominal types

TS is a structural type system, but sometimes we want to be able to differentiate two types with the same structure.

First: intersection types

```ts
type Product = Loggable & Sellable
```

## Opaque types

```ts
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
```

## Smart constructors

```ts
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
```

### Making the smart constructor pattern more general

```ts
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
```

### Restricting function parameters

See [article](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)

```ts
const head = <A>(as: Array<A>): A => as[0] // unsound, can return undefined and error out in runtime

const head2 = <A>(as: Array<A>): A | undefined => as[0] // sound, consumers of head2 must deal with undefined

type NonEmptyArray<A> = Array<A> & { readonly _brand: unique symbol }
const isNonEmpty = <A>(x: Array<A>): x is NonEmptyArray<A> => x.length > 0
const makeNonEmpty = <A>(x: Array<A>): NonEmptyArray<A> =>
  isNonEmpty(x) ? x : throwError(`${x} is an empty array`)

const head3 = <A>(as: NonEmptyArray<A>): A => as[0] // sound, requires checking that the array is not empty before calling head3

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
```

Could we avoid throwing exceptions?
