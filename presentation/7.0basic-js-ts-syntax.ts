/* JS primitives */

const str: string = 'a string'
const num: number = 3
const bool: boolean = true
const nothing: null = null
const undef: undefined = undefined

/* TS primitives */

let unknownType: unknown = undefined

if (typeof unknownType === 'number') {
  add(unknownType, 3)
}

const anything: any = 'thing'

function error(message: string): never {
  throw new Error(message)
}

type literalType = 'north'
type union = literalType | 'south' | 'east' | 'west'

function processUnion(u: union): number {
  switch (u) {
    case 'north':
      return 1
    case 'south':
      return 1
    case 'east':
      return 1
    case 'west':
      return 1
  }
}

/* Product types - Objects, Tuples and Arrays */

let foo: object

const object: { a: string; another: string } = { a: str, another: str }
const tuple: [string, number] = ['Marcos', 3]
const array: number[] = [1, 2, 3]
const array2: Array<number> = [1, 2, 3]

type obj = {
  prop: string
}

const myObj: obj = {
  prop: 'hola',
}

type myGenericObj<A> = {
  prop: A
  optionalProp?: number
}

type myType = {
  prop: string
  [x: string]: any
}

const obj: myType = {
  prop: 'hola',
  hola: 3,
}

/* Functions */

const exclaim: (_: string) => string = s => s + '!'

const exclaim2 = (s: string): string => {
  return s + '!'
}

function exclaim3(s: string): string {
  return s + '!'
}

/* Generic functions */

type idType = <A>(_: A) => A

const id: <A>(_: A) => A = a => a

const id2 = <A>(a: A): A => a

function identity<A>(a: A): A {
  return a
}

const result = identity(num)
