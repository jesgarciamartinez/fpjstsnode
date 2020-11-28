export type F1<A, B> = (_: A) => B
export type F2<A, B, C> = (_: A, __: B) => C
type Predicate<A> = (_: A) => boolean

/*
  Implementa:
  - map
  - filter
  - reduce
  - every: toma un predicado y una lista y devuelve true si todos los elementos de la lista cumplen el predicado, false en caso contrario
  - some: toma un predicado y una lista y devuelve true si alguno de los elementos de la lista cumple el predicado, false en caso contrario
  - find: toma un predicado y una lista y devuelve el primer elemento que cumple el predicado, o null si ninguno lo cumple
  - flat: toma una lista de listas de cualquier tipo y devuelve una lista del mismo tipo
  - flatMap: toma una función A -> B[] y una lista de A y devuelve una lista de B
  - prop: toma un objeto y un nombre de propiedad y devuelve el valor de la propiedad en el objeto
  - pick: toma un objeto y uno o más nombres de propiedades y devuelve un objeto que sólo tiene los nombres y valores de estas propiedades
  - omit: toma un objeto y uno o más nombres de propiedades y devuelve un objeto que tiene las propiedades que tuviera excepto éstas
  - (converge): toma una función de X parámetros y una tupla de X funciones de X parámetros y devuelve una función de X parámetros que serán aplicados a cada una de las funciones de la tupla, con cuyos resultados se llamará a la primera función
 */

export const map = <A, B>(f: F1<A, B>) => (as: A[]): B[] => {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i]
    result.push(f(element))
  }
  return result
}

export const filter = <A>(f: Predicate<A>) => (as: A[]): A[] => {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    const keep = f(a)
    if (keep) {
      result.push(a)
    }
  }
  return result
}

export const reduce = <A, ACC>(f: (acc: ACC, v: A) => ACC, acc: ACC) => (
  as: A[],
): ACC => {
  let result: ACC = acc
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    result = f(result, a)
  }
  return result
}

export function every<A>(p: Predicate<A>, as: A[]): boolean {
  let result = true
  let i = 0
  while (result && i < as.length) {
    const a = as[i]
    result = p(a)
    i++
  }
  return result
}

export function some<A>(p: Predicate<A>, as: A[]): boolean {
  let result = false
  let i = 0
  while (!result && i < as.length) {
    const a = as[i]
    result = p(a)
    i++
  }
  return result
}

export function find<A>(p: Predicate<A>, as: A[]): A | null {
  let found = null
  let i = 0
  while (!found) {
    const a = as[i]
    found = p(a) ? a : null
    i++
  }
  return found
}

export function flat<A>(arrayOfArrays: Array<Array<A>>): Array<A> {
  return reduce((acc, array: A[]) => acc.concat(array), <A[]>[])(arrayOfArrays)
}

export const flatMap = <A, B>(f: (_: A) => Array<B>) => (
  as: Array<A>,
): Array<B> => {
  return flat(map(f)(as))
}
export const flatMap_ = <A, B>(f: (_: A) => Array<B>, as: Array<A>): Array<B> =>
  flatMap(f)(as)

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {} // incompleteness, esto funciona, pero tenemos que usar el cast a any
  keys.forEach(key => {
    ret[key] = obj[key]
  })
  return ret
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (keys.includes(k as K)) {
      return acc
    }
    acc[k] = v
    return acc
  }, <any>{})
}

export const prop = <T, K extends keyof T>(propertyName: K) => (o: T): T[K] => {
  return o[propertyName] // o[propertyName] is of type T[K]
}

/* Creando nuestra propia función match - copiada aquí para exportar */

type Thunk<A> = () => A
type ValueOrThunk<A> = A | Thunk<A>

/* user-defined type guard */
function isThunk<A>(a: ValueOrThunk<A>): a is Thunk<A> {
  return typeof a === 'function'
}

const getValue: <A>(a: ValueOrThunk<A>) => A = a => (isThunk(a) ? a() : a)

type Key = string | number | symbol

type RecordValueOrThunk<T extends Key, Ret> = Record<T, ValueOrThunk<Ret>>

export function match<T extends Key, Ret>(
  prop: T,
  obj: RecordValueOrThunk<T, Ret>,
): Ret
export function match<T extends Key, Ret>(
  prop: T,
  obj: Partial<RecordValueOrThunk<T, Ret>> & { _: ValueOrThunk<Ret> },
): Ret
export function match<T extends Key, Ret>(prop: T, obj: any): Ret {
  const valueOrThunkOrUndefined = obj[prop]
  if (valueOrThunkOrUndefined === undefined) {
    return getValue(obj._)
  }
  return getValue<Ret>(valueOrThunkOrUndefined)
}
