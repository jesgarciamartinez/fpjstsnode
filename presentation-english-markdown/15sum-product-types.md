# Sum and product types

Let's suppose we want to model a hotel with different types of rooms: regular, premium and deluxe.
Regular rooms can have a promotion (`roomPromotion`) and premium/deluxe rooms may include `breakfastService`.

This is our data model - do you see anything wrong with this?

```ts
type Room = {
  isRegularRoom: boolean
  isPremiumRoom: boolean
  isDeluxeSuite: boolean
  breakfastService?: {
    hour: number
    breakfast: {
      option1: boolean
      option2: boolean
    }
  }
  roomPromotion?: {
    discount: number
  }
}
```

Now let's model an HTTP call:

```ts
type NetworkRequest<T> = {
  loading: boolean
  data?: T
  errorMessage?: string
  statusCode?: number
}
```

Whats the type of node callbacks (nodebacks)?

```ts
type Cb = <T>(err?: Error, data?: T) => void
declare function readFile(path: string, callback: Cb): void
```

There are 4 possibilities:

- Error, null ✅
- null, string ✅
- Error string ❌
- undefined undefined ❌

What do these examples have in common?

---

_Cardinality_: number of inhabitants (possible values of) a type.
E.g: the boolean type has cardinality 2: `true` and `false`

### Product types

A collection of types, indexed by a set I.

```ts
declare const tuple1: [string] // I == 0
declare const tuple2: [string, string] // I == 0,1
declare const tuple3: [string, string, string] // I == 0,1,2

type Person = {
  name: string
  age: number
} // I = "name", "age"

declare const myArray: string[] //I == 0,1,2,3,...

declare const tuple4: [null, 'one' | 'two' | 'three'] // cardinality: 3
```

They are called product types because their cardinality is the product of the cardinalities of the types they are made of.
Intuitively, all possible combinations

### Sum types

Data types that can be one of several possibilities, differentiated by a _tag_.

```ts
type Breakfast = 'option1' | 'option2'
type RegularRoom = {
  type: 'RegularRoom' // literal type
  roomPromotion: { discount: number }
}
type PremiumRoom = {
  type: 'PremiumRoom'
  breakfastService: {
    hour: number
    breakfast: Breakfast
  }
}
type DeluxeSuite = {
  type: 'DeluxeSuite'
  breakfastService: {
    hour: number
    breakfast: Breakfast
  }
}
type Room2 = RegularRoom | PremiumRoom | DeluxeSuite

type NetworkRequest2<T> =
  | { type: 'loading' }
  | { type: 'success'; status: number; data: T }
  | { type: 'error'; status: number; message: string }
```

With `const Enum` instead of string literals:

```ts
const enum NetworkRequestEnum {
  Loading,
  Success,
  Error,
}

type NetworkRequestWithEnum<T> =
  | { type: NetworkRequestEnum.Loading }
  | { type: NetworkRequestEnum.Success; status: number; data: T }
  | { type: NetworkRequestEnum.Error; status: number; message: string }

type BetterCallbackApi<T> =
  | { type: 'error'; message: string }
  | { type: 'succcess'; data: T }
```

They are called sum types because their cardinality is the sum of cardinalities of the types they are made of.
Intuitively, the cardinality of every type.

### When do we use product or sum types?

_Product types_: when their properties are independient from each other, all combinations are valid.
_Sum types_: when there's dependencies between properties that we can group together so as to narrow down the state space.
In this way we _make invalid states unrepresentable_.

### How do we consume sum types?

TS provides us a sort of "pattern matching" with "exhaustiveness checking"

```ts
function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

function hasBreakFastService(room: Room2): boolean {
  return !!room.breakFastService //incompleteness, this will not be a runtime error, but TS flags it as one
}

function hasBreakFastService2(room: Room2): boolean {
  /* to ensure exhaustiveness checking, we can write the return type...*/
  switch (room.type) {
    case 'DeluxeSuite': // refinement, TS knows from this point on room is a 'DeluxeSuite'
      return !!room.breakfastService
    case 'PremiumRoom':
      return !!room.breakfastService
    case 'RegularRoom':
      return true
    default:
      /*... or we can assign `room` to `never` in the default branch*/
      assertNever(room)
    //   let x: never = room
  }
}
```
