export type F1<A, B> = (_: A) => B
export type F2<A, B, C> = (_: A, __: B) => C

/*
  Exercises - implement:
  
  - map
  - filter
  - reduce
  - every
  - some
  - find
  - flat
  - flatMap
  - prop
  - pick
  - omit
  - (converge from ramda.js)
 */

export const map = <A, B>(f: (_: A) => B) => (as: A[]): B[] => {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i]
    result.push(f(element))
  }
  return result
}

export const filter = <A>(f: (_: A) => boolean) => (as: A[]): A[] => {
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

type Predicate<A> = (_: A) => boolean

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
  const ret: any = {} // incompleteness, this should work, but we have to cast to any
  keys.forEach(key => {
    ret[key] = obj[key]
  })
  return ret
}

export const prop = <T, K extends keyof T>(propertyName: K) => (o: T): T[K] => {
  return o[propertyName] // o[propertyName] is of type T[K]
}
