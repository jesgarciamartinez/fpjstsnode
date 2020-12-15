type Nothing = { readonly _tag: 'Nothing' }
import { pipe } from './11.1fp-ts-pipe'
type Just<A> = { readonly _tag: 'Just'; readonly value: A }
type Maybe<A> = Just<A> | Nothing

const just = <A>(a: A): Just<A> => ({ _tag: 'Just', value: a })
const nothing: Maybe<never> = { _tag: 'Nothing' }
const isNothing = <A>(ma: Maybe<A>): ma is Nothing => ma._tag === 'Nothing'

const map = <A, B>(f: (_: A) => B) => (ma: Maybe<A>): Maybe<B> =>
  ma._tag === 'Just' ? just(f(ma.value)) : nothing

/* Maybe es un _functor_, es decir, una estructura de datos sobre la que podemos "mapear"*/
/*   Los functores deben cumplir dos leyes:
    - map(id) == id
    - map (f ∘ g) == (map f) ∘ (map g) 
 */

const flatMap = <A, B>(f: (a: A) => Maybe<B>) => (ma: Maybe<A>): Maybe<B> =>
  isNothing(ma) ? nothing : f(ma.value)

/* Maybe también es una _mónada_, es decir, una estructura de datos 
   con una implementación para "flatMap", también llamado frecuentemente "chain" o "bind"
*/

export const chain = flatMap

/* Revisitando Smart constructor 
   Con fp-ts: https://dev.to/gcanti/functional-design-smart-constructors-14nb
*/

type Refinement<P, T extends P> = (x: P) => x is T
type SmartConstructor<P, T> = (x: P) => Maybe<T> /* ❌  CanThrow<T>  */

const refineWith: <P, T extends P>(
  f: Refinement<P, T>,
  /*e: (_: P) => string,*/
) => SmartConstructor<P, T> = /*
 */ (f /*e*/) => x => (f(x) ? just(x) : nothing)

type NonZeroNumber = number & { readonly _brand: unique symbol }
const isNonZero = (x: number): x is NonZeroNumber => x !== 0
const makeNonZero = refineWith(isNonZero)

const divide = (n: number) => (m: NonZeroNumber): number => n / m

divide(1)(0) //❌ TypeError

const n = 1
const m = makeNonZero(n)

pipe(m, map(divide(1))) //✅
