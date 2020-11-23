/*

Curry

Convertir una función variádica en una función de un sólo argumento, 
que retorna una función que toma el siguiente argumento 
y así sucesivamente hasta que se pasen todos los argumentos de la función original.

*/
import { map, reduce } from './9.1map-filter-reduce'
import { prop } from './12.3utils'

const add = (a: number, b: number): number => a + b
const inc = (x: number) => add(x, 1)
const addCurried = (a: number) => (b: number): number => a + b
const incCurried = addCurried(1)

/* Point-free programming / tacit programming */

const people = [
  { name: 'Marcos', age: 3 },
  { name: 'Laura', age: 27 },
  { name: 'Luis', age: 38 },
  { name: 'Javi', age: 29 },
]

people.map(prop('age')).reduce(add, 0) //-> 97

reduce(add, 0, map(prop('age'), people)) //-> 97

export function curry(fn) {
  let arity = fn.length
  return function curried(...args) {
    let firstArgs = args.length
    if (firstArgs >= arity) {
      return fn(...args)
    } else {
      return (...secondArgs) => {
        return curried(...[...args, ...secondArgs])
      }
    }
  }
}
