# Functions in JS/TS

## Functions are first-class citizens

Functions are like any other data type in the language. They can

- be put in variables
- take other functions as parameters (higher-order function)
- return other functions (higher-order function):

```javascript
const filter = predicate => {
  return xs => {
    const result = []
    for (let idx = 0; idx < xs.length; idx++) {
      if (predicate(xs[idx])) {
        result.push(xs[idx])
      }
    }
    return result
  }
}
```

## Pure functions

Functions that only take inputs and return outputs, without side effects.

```javascript
// impure
const add = (x, y) => {
  launchMissiles() //side-effect execution
  return x + y
}

// pure
const add = (x, y) => x + y
```

### Advantages of pure functions

- predictable (same input -> same output)
- allow local reasoning
- easily testable (no mocks)

#### What are side-effects?

- Affect state outside the program (reason for programs to be run)
  - API calls, Dbs
  - I/O
- Affect mutable memory inside the program

```js
import moment from 'moment'

const today = moment()
/*...*/
const nextWeek = today.add(7, 'days') //❌  bug
```

There's a bug introduced by mutability - `today` is no longer today, it's mutated.
Both `today` and `nextWeek` point to the same object.

Fixed:

```js
import moment from 'moment'

const today = moment()
/*...*/
const nextWeek = today.clone().add(7, 'days')
```
