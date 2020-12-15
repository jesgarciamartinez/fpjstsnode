/* Type guards */

type Dog = { a: number }
type Cat = { b: string | number }

/*                              user-defined     in            
                                   --            --        */
const userDefined = (o: object): o is Dog => 'a' in o

const typeofTypeGuard = (cat: Cat) =>
  typeof cat.b === 'number' ? cat.b + 1 : cat.b + '!'

/* Optional chaining (?.) and nullish coalescing (??) */
type VeryOptional = {
  a?: {
    b?: {
      c: string
    }
  }
}
const vo: VeryOptional = { a: { b: { c: ':)' } } }
const s: string | undefined = vo?.a?.b?.c

function f(stringOrNull: string | null): string {
  return stringOrNull ?? 'default'
}

/* Index types */

/*                                index type query operator         indexed access operator
                                         -------                          ----      */
export function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName] // o[propertyName] is of type T[K]
}

/* Index signatures */

interface NumberKeys<T> {
  [key: string]: T // sólo string o number
}

/* Mapped Types */

type Direction = 'north' | 'south' | 'east' | 'west'

/*                           ----------------                */
type DirectionsToBoolean = { [K in Direction]: boolean }

/* Make all properties in T optional */
type Partial<T> = {
  [P in keyof T]?: T[P]
}

/* Make all properties in T required */
type Required<T> = {
  [P in keyof T]-?: T[P] //-? para quitar opcionalidad
}

/* Make all properties in T readonly */
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

/* From T, pick a set of properties whose keys are in the union K */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Obj = { a: string; b: number; c: boolean }
type AC = Pick<Obj, 'a' | 'c'>

/* implement pick */

/**
 * Construct a type with a set of properties K of type T
 * keyof any represents the type of any value that can be used as an index to an object.
 * keyof any: string | number | symbol.
 */
type Record<K extends keyof any, T> = {
  [P in K]: T
}

/**
 *
 * Conditional types
 *
 * T extends U ? X : Y
 *
 * Distributive:
 * T extends U ? X : Y with the type argument A | B | C for T
 * is resolved as (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y).
 */

/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U = 'id'> = T extends U ? never : T

type MyExcludedType = Exclude<{ a: number; b: number; c: number }>

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

type MyOmmitedType = Omit<{ a: number; b: number; c: number }, 'a' | 'b'>

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T

type MyNullable = 'a' | null | undefined
type MyNonNullable = NonNullable<MyNullable>

/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

const myFn = (n: number): number => n
type MyFnParameters = Parameters<typeof myFn>

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any

/* Implementa: RequireOne<T, K>
   Implementa: hof que use console.time para comprobar cuánto tarda en ejecutarse una función
   Implementa: memoize
   Implementa: "wrapper" alrededor de un object que promisifique métodos
*/
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

/* String literal types en TS 4.1*/

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

/* Más tipos avanzados: https://github.com/sindresorhus/type-fest */
