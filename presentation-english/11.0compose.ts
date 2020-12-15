/* 
Function composition: we can compose two functions where the return type of one is the entry (parameter) type of the other

If g has type A -> B and f has type B -> C

A ---g--> B ---f--> C

A ---f ∘ g --> C

*/

/* compose :: (B -> C) -> (A -> B) -> A -> C */ // Hindley-Milner type system

export const compose = f => g => a => f(g(a))
const flow = (f, g) => x => g(f(x))

/* Implement a variadic compose function, that takes any number of functions and composes them right-to-left */

function variadicCompose(...fns) {
  return function (arg) {
    /* imperative implementation

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

/* Implement a variadic flow function, that takes any number of functions and composes them left-to-right */

const variadicFlow = (...fns) => arg =>
  fns.reduce((result, fn) => fn(result), arg)
