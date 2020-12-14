/* Técnicas para inmutabilidad JS */

/*
  Modificar un objeto  
*/

const o = { a: 1, b: 2, nested: { prop1: 4, prop2: 5 } }
const newO = { ...o, b: 3 } //equivalente a Object.assign({}, o, {b: 3})
const newNested = { ...o, nested: { ...o.nested, prop2: 6 } }

/* Modificar un array */

/**
 * Métodos de Array que mutan el array sobre el que operan
 */

const array: number[] = [1, 2, 3]

array.push(4) //-> array: [1,2,3,4]
array.pop() //-> array: [1,2,3]
array.shift() //-> array: [2,3]
array.unshift(1) //-> array: [1,2,3]
array.reverse() //-> array: [3,2,1]
array.sort() //-> array: [1,2,3]
array.splice(0, 1) //-> array: [2,3]

const newArray = [...array] // equivalente a array.slice()
const arrayWithNewItem = [...array.slice(0, 1), item, ...array.slice(1)]

/* Técnicas para inmutabilidad TS */

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

/* Readonly arrays no permiten usar métodos que mutan el array*/

const roArray: ReadonlyArray<number> = [1, 2, 3]
roArray.push(4)

/* Tipo Readonly recursivo 
   https://github.com/krzkaczor/ts-essentials#deep-wrapper-types
*/

/* Librerías para inmutabilidad
   Usan structural sharing para evitar problemas de memoria al crear constantemente nuevos objetos
   Immutable usa lazyness (con `Seq`) para evitar problemas de performance al aplicar varias transformaciones
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
