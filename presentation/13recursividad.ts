/*
  Hasta ahora, hemos tratado de construir funciones de orden superior para encapsular y reutilizar constructos
  de bajo nivel, como for-loops y while-loops.
  
  En realidad, ni siquiera necesitamos estos constructos para iterar: como nuestras funciones son de ciudadanos de primera clase y de orden superior,
  pueden llamarse a sí mismas en el cuerpo de la función. 

  A esto lo llamamos recursión.
  
  Libro: Structure and Interpretation of Computer Programs, cap. 1:
  https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html
*/

/* Implementa map de forma recursiva*/

export const map = <A, B>(f: (a: A) => B, as: A[]): B[] => {
  const [first, ...rest] = as
  return first === undefined ? [] : [f(first), ...map(f, rest)]
}

/*
   Implementa la función factorial, que toma un número y devuelve su factorial n!? (n! === n * (n - 1) * (n -2) ... 1 
*/

const factorial = (n: number): number => (n === 0 ? 1 : n * factorial(n - 1))

/**
 *  factorial(3)
 *  3 * factorial(2)
 *  3 * 2 * factorial(1)
 *  3 * 2 * 1 * factorial(0)
 *  3 * 2 * 1 * 1
 *  3 * 2 * 1
 *  3 * 2
 *  6
 */

const factorialTailRec = (n: number): number => {
  const go = (n: number, acc: number): number =>
    n === 0 ? acc : go(n - 1, n * acc)
  return go(n, 1)
}
/*
  Con ES2015 se incluyó "tail recursion optimization" en el spec de JS, pero los navegadores (y node, que usa V8) no lo implementan.
 */
