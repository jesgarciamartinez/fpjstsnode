/* ¿Qué tienen en común funciones como compose, id, apply? 
   En su implementación tan sólo se usan los parámetros que reciben y aplicación de funciones.

   https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45
*/

/* flip :: (a, b) → c → (b, a) → c */

type F2<A, B, C> = (_: A, __: B) => C

const flip = <A, B, C>(f: F2<A, B, C>) => (x: B, y: A): C => f(y, x)

const compose = f => g => a => f(g(a))
const flow = flip(compose)

/* apply ::  (a → b) → a → b */

const apply = f => a => f(a)

/* psi :: (b → b → c) → (a → b) → a → a → c */
const psi = f => g => x => y => f(g(x))(g(y))

const greaterThan = (n: number) => (m: number): boolean => n > m
const length = (arr: unknown[]) => arr.length

const compareArrayLengths = psi(greaterThan)(length)([1, 2, 3])([1, 2, 3, 4]) // -> false

/* blackbird :: (c -> d) -> (a -> b -> c) -> a -> b -> d */
// const blackbird = cd => abc => a => b => cd(abc(a)(b))
const blackbird = compose(compose)(compose)

const map = f => as => as.map(f)
const prop = key => obj => obj[key]
const reduce = (f, acc) => as => as.reduce(f, acc)
const add = (a, b) => a + b
const sum = reduce(add, 0)

const people = [
  { name: 'Marcos', age: 3 },
  { name: 'Laura', age: 27 },
  { name: 'Luis', age: 38 },
  { name: 'Javi', age: 29 },
]

const sumAge = blackbird(sum)(map)(prop('age'))
console.log(sumAge(people)) //-> 97
