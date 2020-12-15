/*
  Property-based testing: testear _el contrato_ de una función con valores generados automáticamente
*/

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

// Associative: a + (b + c) = (a + b) + c
// Distributive: a*(b + c) = a*b + a*c

/* ¿Qué propiedades testear? 

   Existen algunas estrategias para encontrarlas:
  
   Contracts pasan
   Sanity check

   Oráculos
  
   Invariantes

   Isomorfismos: 
*/
declare function reverse<A>(_: A[]): A[]

reverse(reverse([1, 2, 3])) //equivale a  [1,2,3]
compose(reverse)(reverse)([1, 2, 3]) //equivale a id(1,2,3)

Object.entries({ a: 1, b: 2 }) //-> [['a', 1],['b', 2]]
Object.fromEntries([
  ['a', 1],
  ['b', 2],
]) //-> {a: 1, b: 2}
compose(Object.fromEntries)(Object.entries) // equivale a id
