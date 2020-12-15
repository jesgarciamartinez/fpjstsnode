# Recursion

So far we've built higher order functions to encapsulate and reuse lower level constructs, like for-loops and while-loops.
We actually don't even need these constructs to iterate: since our functions are first-class citizens and higher-order,
they can call themselves in the body of the function.
We call this recursion.

See free online book: [Structure and Interpretation of Computer Programs, 1st chapter](https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html)

Implement map recursively

```ts
export const map = <A, B>(f: (a: A) => B, as: A[]): B[] => {
  const [first, ...rest] = as
  return first === undefined ? [] : [f(first), ...map(f, rest)]
}
```

Implement the factorial function, which takes a number and returns its factorial n!
`n! === n * (n - 1) * (n -2) ... 1`

```ts
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
```

ES2015 included "tail call optimization" in the JS spec, but browsers (and node, which runs on V8) don't implement it.

```ts
const factorialTailRec = (n: number): number => {
  const go = (n: number, acc: number): number =>
    n === 0 ? acc : go(n - 1, n * acc)
  return go(n, 1)
}
```
