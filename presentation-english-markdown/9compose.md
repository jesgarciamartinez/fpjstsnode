# Function composition 

We can compose two functions where the _return type_ of one is the _entry (parameter) type_ of the other

If g has type A -> B and f has type B -> C

A ---g--> B ---f--> C

A ---f ∘ g --> C

```js
/* compose :: (B -> C) -> (A -> B) -> A -> C */

export const compose = f => g => a => f(g(a))
const flow = (f, g) => x => g(f(x))
```

Exercise: Implement a variadic compose function, that takes any number of functions and composes them right-to-left.

```js
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
```

Exercise: Implement a variadic flow function, that takes any number of functions and composes them left-to-right

```js
const variadicFlow = (...fns) => arg =>
  fns.reduce((result, fn) => fn(result), arg)
```
