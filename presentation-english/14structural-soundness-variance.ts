/*

TypeScript is a gradual type system - it accommodates existing JS idioms and is can be adopted little by little in a JS project.

TypeScript is a *structural* type system, where the _properties_ of types determine if they are _assignable_ to another type,
or, equivalently (https://www.typescriptlang.org/docs/handbook/type-compatibility.html#subtype-vs-assignment), if they are _subtypes of_ another type.

We think of types as _sets_ of values that _inhabit_ them. 
A value can belong to more than one set.

This is different form other *nominal* type systems, where the identity of a type (its "name") is what determines if it's
assignable to another type.

Let's review objects and functions:
*/

/* Objects */

class C1 {
  method(_: string) {
    /* ... */
  }
}
class C2 {
  method(_: string) {
    /* ... */
  }
  a = 2
}

let c1: C1 = new C2()

c1.method('string')

export const myObj: C1 = {
  method(_: string) {},
  a: 1,
}

/* Functions */
/* Functions with less parameters (of assignable types) are assignable to functions with more parameters.*/

function handler(_: string) {}

function doSomething(callback: (arg1: string, arg2: number) => void) {
  callback('hello', 42)
}

doSomething(handler) //this works, even if the callback declares 2 parameters and the handler only has one
;[1, 2, 3].map(v => v * 2)

/*

Soundness and completeness

Type systems are in a <-sound---complete-> spectrum. 

A system is sound if it finds every possible type error (TypeError) that can happen at runtime, which means, if it
compiles, there will never be TypeErrors at runtime. There are no false negatives ("positive" meaning a type error is found).
This helps us write "correct" programs at the design/type level.

A system is complete if it accepts every program that cannot have an error in runtime.
There are no false positives.
This helps us write idiomatic code, without nagging us when there is no error.

There is a tradeoff between this two properties.
TypeScript is not completely sound: it's strategically unsound to favor developer experience, that is, to be more complete.

See talk: https://www.youtube.com/watch?v=uJHD2xyv7xo&t=413s 
*/

/* Unsoundness in TS:

   Array indexing
   Invalid refinement
   Mutable covariant arrays
*/

/*Array indexing */

const element = ['a', 'b'][10] //out of bounds
element.toLowerCase()

/* Invalid refinement */

const numbers: Array<number | undefined> = [1, 2, undefined, 3]
for (let i = 0; i < strings.length; i++) {
  let element = numbers[i]
  function mutateElement() {
    element = undefined
  }
  if (element !== undefined) {
    mutateElement() //invalid refinement: TS thinks the element is of type number, but element is undefined
    element
  }
}

/* Mutable covariant arrays */

function mutateArray(arr: Array<string | number>): void {
  arr.push(42)
}
const strings: Array<string> = ['a', 'b']
mutateArray(strings)

strings[2].toLowerCase() // runtime error

/* Variance

  How do subtypes of generic types and functions work in relation with the subtypes of the types they contain?

  4 options:

  Invariant
  Covariant
  Contravariant
  Bivariant (covariant and contravariant)

  "<" means "is subtype of" or "is assignable to"
*/

type Animal = { a: number }
type Dog = { a: number; b: number; c: number }
type Spaniel = { a: number; b: number; c: number; d: number }
type Cat = { a: number; d: number }

/* Array variance:

  Invariant:     Dog < Animal -> Array<Dog> y Array<Animal> are not compatible 😕 
  Covariant:     Dog < Animal -> Array<Dog> < Array<Animal> ✅ IFF we don't mutate the array
  Contravariant: Dog < Animal -> Array<Dog> > Array<Animal> ❌  if we need Dogs, any other Animal won't suffice
  Bivariant:     Dog < Animal -> Array<Dog> < > Array<Animal> ❌
*/

/* Mutable covariant Arrays are unsound - can lead to a type error */

function mutateAnimalsArray(a: Array<Animal>): void {
  const cat: Cat = {
    a: 1,
    d: 3,
  }
  a.push(cat)
}

declare const dogs: Array<Dog>
mutateAnimalsArray(dogs)

const myFn = (f: (_: Dog) => string) => {
  const dog = {
    a: 1,
    b: 1,
    c: 1,
  }
  const str = f(dog)
}

function g(_: Spaniel): string {
  return _.d === 1 ? 'yes' : 'no'
}

myFn(g)

/* Function variance - functions are "containers" of 2 types: the ones they take as parameters and the ones they return
   as a result of applying the function: A -> B

   For the system to be sound, functions must be covariant in their return types and contravariant in their
   parameter types.

   The intuition for this is that a function is a subtype of another function if it can give more guarantees in its postconditions (a more specific return value)
   or it needs less requirements/preconditions to be called (more lax in its parameters).
    
   Variance in return types:

  Invariant:     Dog < Animal -> () => Dog y () => Animal are not compatible 😕 
  Covariant:     Dog < Animal -> () => Dog < () => Animal ✅
  Contravariant: Dog < Animal -> () => Dog > () => Animal ❌ 
  Bivariant:     Dog < Animal -> () => Dog < > () => Animal ❌

  Variance in parameter types:

  Invariant:     Dog < Animal -> (Dog => _) y (Animal => _) are not compatible 😕 
  Covariant:     Dog < Animal -> (Dog => _) < (Animal => _) ❌
  Contravariant: Dog < Animal -> (Dog => _) > (Animal => _) ✅ In TS, only if --strictFunctionTypes is set to `true`.
  Bivariant:     Dog < Animal -> (Dog => _) < > (Animal => _) ❌ Normal TS behavior

  We can consider generic types in terms of them being "producers" o "consumers" of other types.
  
  Producers: Immutable data types (ReadonlyArray), we only read their content. 
             Also function outputs.
             Covariance ✅ 
  Consumers: Mutable data types that will receive values.
             Also function parameters.
             Invariance or contravariance ✅ 
 */
