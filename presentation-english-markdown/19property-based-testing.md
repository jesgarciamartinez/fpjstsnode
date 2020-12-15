# Property-based testing

## Testing the contract of a function, with automatically generated values

```ts
const assert = require('assert').strict
import * as fc from 'fast-check'
const test = require('tape-catch')

const add = (x: number, y: number): number => x + y

test('regular unit test', (t: any) => {
  assert(add(2, 2) === 4)

  t.end()
})

test('commutative', (t: any) => {
  const num = fc.integer()

  const commutativity = (x: number, y: number): boolean =>
    add(x, y) === add(y, x)

  fc.assert(fc.property(num, num, commutativity), { verbose: 2 })

  t.end()
})
```

Other possible properties we could test for the `add` function:

- Associative: a + (b + c) = (a + b) + c
- Distributive: a*(b + c) = a*b + a\*c

### What properties _should_ we test?

How do we find suitable properties to test?
There are [several strategies](https://fsharpforfunandprofit.com/posts/property-based-testing-2/) to find them:

- Contracts don't throw
- Sanity check
- Oracles
- Isomorphisms

Isomorphisms:

```ts
declare function reverse<A>(_: A[]): A[]

reverse(reverse([1, 2, 3])) //equivale a  [1,2,3]
compose(reverse)(reverse)([1, 2, 3]) //equivale a id(1,2,3)

Object.entries({ a: 1, b: 2 }) //-> [['a', 1],['b', 2]]
Object.fromEntries([
  ['a', 1],
  ['b', 2],
]) //-> {a: 1, b: 2}
compose(Object.fromEntries)(Object.entries) // equivale a id
```
