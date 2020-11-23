/*
  Supongamos que queremos modelar un hotel con diferentes habitaciones:
  Hay habitaciones normales (regular), premium y deluxe. 
  Asimismo, las habitaciones normales pueden tener una promoción (roomPromotion), y las premium/deluxe
  pueden incluir servicio de desayuno (breakFastService).
  
  Este es el modelo de datos que tenemos:
 */

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

/*
  Supongamos que queremos modelar una llamada HTTP:
 */
type NetworkRequest<T> = {
  loading: boolean
  data?: T
  errorMessage?: string
  statusCode?: number
}

/* ¿Cuál es el tipo de los callback de Node? nodebacks
 */
type Cb = <T>(err?: Error, data?: T) => void
declare function readFile(path: string, callback: Cb): void

/*
Error, null ✅
null, string ✅
Error string ❌
undefined undefined ❌
*/

/* ¿Qué tienen en común estos ejemplos? */

/*

Cardinalidad: Número de habitantes (posibles valores) de un tipo.
P. ej: el tipo boolean tiene cardinalidad 2: true y false
*/

/*
Tipos producto
Collección de tipos, indexada por un set I.
*/
declare const tuple1: [string] // I == 0
declare const tuple2: [string, string] // I == 0,1
declare const tuple3: [string, string, string] // I == 0,1,2

type Person = {
  name: string
  age: number
} // I = "name", "age"

declare const myArray: string[] //I == 0,1,2,3,...

declare const tuple4: [null, 'one' | 'two' | 'three']

/* Se llaman producto porque su cardinalidad es el producto de las cardinalidades de los tipos que lo constituyen.
   Intuitivamente, todas las combinaciones posibles */

/*

Tipos suma
Tipos de dato que pueden ser una de varias posibilidades, distinguidas por un "tag".

*/
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

/* Con Enum en vez de string literals */

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

// tagged sum types //disjoint unions

/* Se llaman suma porque su cardinalidad es la suma de las cardinalidades de los tipos que lo constituyen.
   Intuitivamente, la cardinalidad de cada uno de sus constituyentes */

/*
¿Cuándo usamos tipos suma o producto?

Tipos producto - cuando sus propiedades son independientes entre sí, todas las combinaciones son validas.
Tipos suma - cuando hay dependencias entre propiedades que podemos agrupar para acotar el espacio de estados posibles.
y hacer los estados inválidos irrepresentables.
*/

/*
 Cómo consumimos tipos suma?
 TS nos provee de "pattern matching" con "exhaustiveness checking"
*/

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

function hasBreakFastService(room: Room2): boolean {
  return !!room.breakFastService //incomplete, esto no da error y TS lo marca como error
}

function hasBreakFastService2(room: Room2): boolean {
  switch (room.type) {
    case 'DeluxeSuite': // refinamiento, TS sabe que a partir de aquí room es de tipo 'DeluxeSuite'
      return !!room.breakfastService
    case 'PremiumRoom':
      return !!room.breakfastService
    case 'RegularRoom':
      return true
    default:
      assertNever(room)
    //   let x: never = room
  }
}

/* Creando nuestra propia función match */

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

/* Ejemplo de uso */

type DirectionLiterals = 'north' | 'east' | 'south' | 'west'
const enum DirectionEnum {
  North,
  East,
  South,
  West,
}

function DirectionEnumToString(d: DirectionEnum): string {
  return match(d, {
    [DirectionEnum.North]: () => 'You can use a thunk',
    [DirectionEnum.East]: 'or the return value directly',
    _:
      'using "_" will catch all non-specified possibilities and turn off exhaustiveness checking',
  })
}
function DirectionLiteralsToString(d: DirectionLiterals): string {
  const result = match(d, {
    north: () => 'You can use a thunk',
    east: 'or the return value.',
    south: 'All possibilities must be present if not using the "_" wildcard;',
    west: 'otherwise it will not typecheck',
  })
  return result
}

type Predicate<T> = (t: T) => boolean
export function matchP<T extends Key, Ret>(
  a: T,
  ...cases: ReadonlyArray<[Predicate<T> | boolean, ValueOrThunk<Ret>]>
): Ret | null {
  for (let i = 0, len = cases.length; i < len; i++) {
    const [booleanOrpredicate, valueOrThunk] = cases[i]
    const boolean =
      typeof booleanOrpredicate === 'function'
        ? booleanOrpredicate(a)
        : booleanOrpredicate
    if (boolean) {
      return getValue<Ret>(valueOrThunk)
    }
  }
  return null
}
