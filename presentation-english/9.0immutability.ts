/* Immutability techniques in JS */

/*
  Modify an object
*/

const o = { a: 1, b: 2, nested: { prop1: 4, prop2: 5 } }
const newO = { ...o, b: 3 } //equivalent to Object.assign({}, o, {b: 3})
const newNested = { ...o, nested: { ...o.nested, prop2: 6 } }

/* Modify an array */

/**
 * Array methods that mutate the array they operate on
 */

const array: number[] = [1, 2, 3]

array.push(4) //-> array: [1,2,3,4]
array.pop() //-> array: [1,2,3]
array.shift() //-> array: [2,3]
array.unshift(1) //-> array: [1,2,3]
array.reverse() //-> array: [3,2,1]
array.sort() //-> array: [1,2,3]
array.splice(0, 1) //-> array: [2,3]

const newArray = [...array] // equivalent to array.slice()
const arrayWithNewItem = [...array.slice(0, 1), 'item', array.slice(1)]

/* Immutability techniques in TS */

/* Readonly props */

type ObjWithReadonlyProps = {
  readonly a: number
  readonly b: string
}

const objWithReadonlyProps: ObjWithReadonlyProps = {
  a: 1,
  b: 'b',
}

objWithReadonlyProps.b = 'impossible'

/* Readonly arrays don't allow methods that mutate the array*/

const roArray: ReadonlyArray<number> = [1, 2, 3]
roArray.push(4)

/* Recursive readonly type
   https://github.com/krzkaczor/ts-essentials#deep-wrapper-types
*/

/* Immutability libraries
   They use structural sharing to avoid memory problems associated with frequently creating new objects
   Immutable uses lazyness (with its `Seq` type) to avoid performance problems when applying several transformations
*/

/* Immutable.js */

const { Map, List } = require('immutable')
const immutableObj = Map({ list: List([1, 2, 3]), prop: 'a' })
const newObj = immutableObj.set('prop', 'b')

/* Immer.js */

import produce from 'immer'

const obj = {
  array: [1, 2, 3],
  prop: 'a',
}

const newObject = produce(obj, draft => {
  draft.array.push(4)
  draft.prop = 'b'
})
