# Compositionality

> Wikipedia: In mathematical logic and related disciplines, the principle of compositionality is the principle that the meaning of a complex expression is determined by the meanings of its constituent expressions and the rules used to combine them

> [On compositionality](https://julesh.com/2017/04/22/on-compositionality/): the principle that a system should be designed by composing together smaller subsystems, and reasoning about the system should be done recursively on its structure.
> ...not just the ability to compose objects, but the ability to work with an object after intentionally forgetting how it was built. The part that is remembered is the ‘interface’, which may be a type, or a contract, or some other high-level description. The crucial property of interfaces is that their complexity stays roughly constant as systems get larger.
> the opposite of compositionality is emergent effects. The common definition of emergence is a system being ‘more than the sum of its parts’

## Compositionality examples

### Sums, products of numbers

```ts
const one: number = 1
const two: number = 2
const three: number = 3

1 + (2 + 3) === 1 + 2 + 3
```

But not division!

```ts
1 / 0 //-> NaN
```

### String methods

```ts
const myString: string = 'Compositionality '
  .trim()
  .toUpperCase()
```

### Boolean operations

```ts
const t: boolean = true
const f: boolean = false

;(t && f) || (t && f)
```
