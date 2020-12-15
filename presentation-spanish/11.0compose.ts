/* 
Composición de funciones: podemos componer dos funciones en las que el tipo de salida de una sea el de entrada de la otra

Si g es una función A -> B y f es una función B -> C

A ---g--> B ---f--> C

A ---f ∘ g --> C

*/

/* compose :: (B -> C) -> (A -> B) -> A -> C */ // Hindley-Milner type system

export const compose = f => g => a => f(g(a))
// const flow = (f, g) => x => g(f(x))

/* Implementa la función compose variádica, que toma cualquier número de funciones y las compone de derecha a izquierda */

function variadicCompose(...fns) {
  return function (arg) {
    /* implementación imperativa
    fns.reverse()
    let result = arg

    for (let i = 0; i < fns.length; i++) {
      const fun = fns[i]
      result = fun(result)
    }

    return result
    */
    return fns.reduceRight((result, fn) => fn(result), arg)
  }
}

/* Implementa la función flow variádica, que toma cualquier número de funciones y las compone de izquierda a derecha */

const variadicFlow = (...fns) => arg =>
  fns.reduce((result, fn) => fn(result), arg)
