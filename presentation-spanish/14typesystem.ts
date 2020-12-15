/*

Typescript es un sistema gradual de tipos - se acomoda a los idiomas de JS y se puede adoptar poco a poco en un proyecto JS

Typescript usa un sistema de tipos *estructural*, en el que las _propiedades_ de los tipos determinan si son _asignables_ a
(o, equivalentemente, si son "subtipos" de) otro tipo.

Pensamos en los tipos como _sets_ de valores. 
Un valor puede pertenecer a más de un set.

Esto contrasta con otros sistemas de tipos *nominales*, en los que la identidad de un tipo (su "nombre") es lo que determina
si es asignable a otro tipo.

Comparemos tipos primitivos, objetos y funciones:
*/

/* Objetos */

class C1 {
  method(_: string) {
    /* ... */
  }
}
class C2 {
  method(_: string) {
    /* ... */
  }
  a = 2
}

let c1: C1 = new C2()

c1.method('string')

export const myObj: C1 = {
  method(_: string) {},
  a: 1,
}

/* Funciones */
/* Las functions con menos parámetros (de los mismos tipos) siempre pueden tomar el lugar de funciones con más parámetros.*/

function handler(_: string) {}

function doSomething(callback: (arg1: string, arg2: number) => void) {
  callback('hello', 42)
}

doSomething(handler) //funciona, auque el callback declare 2 parámetros, y handler sólo tenga uno
;[1, 2, 3].map(v => v * 2)

/*

Soundness y completeness

Los sistemas de tipos están en un espectro <-sound---complete->

Un sistema es "sound" si encuentra todos los posibles errores de tipos (TypeError) que pueden ocurrir en tiempo de ejecución,
es decir, que, si compila, nunca habrá TypeErrors en tiempo de ejecución. No hay "falsos negativos".
Te ayuda a escribir programas "correctos" en el nivel de diseño.

Un sistema es "complete" si acepta todos los programas que no pueden dar error en tiempo de ejecución.
No hay "falsos positivos".
Te ayuda a escribir programas "idiomáticos", a dejarte escribir código que no dará errores.

Estas dos propiedades son un tradeoff. 
Typescript no es completamente "sound": es estratégicamente "unsound" para favorecer la experiencia de usuario (no ser molesto),
es decir, ser más "complete".
*/

/* Casos de unsoundness en TS:

   Array indexing
   Invalid refinement
   Mutable covariant arrays
*/

/*Array indexing */

const element = ['a', 'b'][10] //out of bounds
element.toLowerCase()

/* Invalid refinement */

const numbers: Array<number | undefined> = [1, 2, undefined, 3]
for (let i = 0; i < strings.length; i++) {
  let element = numbers[i]
  function mutateElement() {
    element = undefined
  }
  if (element !== undefined) {
    mutateElement() //invalid refinement: TS cree que element es de tipo number, pero element es undefined
    element
  }
}

/* Mutable covariant arrays */

function mutateArray(arr: Array<string | number>): void {
  arr.push(42)
}
const strings: Array<string> = ['a', 'b']
mutateArray(strings)

strings[2].toLowerCase() // run-time error

/* Varianza

  ¿Cómo funcionan los subtipos de funciones y tipos genéricos en relación con los subtipos de los tipos que contienen? 

  4 opciones:

  Invariante 
  Covariante 
  Contravariante
  Bivariante (covariante y contravariante)

  Usamos "<" para indicar "es subtipo de"
*/

type Animal = { a: number }
type Dog = { a: number; b: number; c: number }
type Spaniel = { a: number; b: number; c: number; d: number }
type Cat = { a: number; d: number }

/* Varianza para Arrays:

  Invariante:     Dog < Animal -> Array<Dog> y Array<Animal> no son compatibles 😕 
  Covariante:     Dog < Animal -> Array<Dog> < Array<Animal> ✅ SÓLO SI no mutamos el array
  Contravariante: Dog < Animal -> Array<Dog> > Array<Animal> ❌  si necesitamos Dogs, no nos vale cualquier Animal
  Bivariante:     Dog < Animal -> Array<Dog> < > Array<Animal> ❌
*/

/* Array mutable covariante es unsound - puede dar lugar a type error */

function mutateAnimalsArray(a: Array<Animal>): void {
  const cat: Cat = {
    a: 1,
    d: 3,
  }
  a.push(cat)
}

declare const dogs: Array<Dog>
mutateAnimalsArray(dogs)

const myFn = (f: (_: Dog) => string) => {
  const dog = {
    a: 1,
    b: 1,
    c: 1,
  }
  const str = f(dog)
}

function g(_: Spaniel): string {
  return _.d === 1 ? 'yes' : 'no'
}

myFn(g)

/* Varianza para funciones - las funciones son "contenedores" de 2 tipos: los que toman como parámetros y los que devuelven
   como resultado de la función: A -> B

   Para que el sistema sea "sound", las funciones deben ser covariantes en sus return types y contravariantes en los
   parámetros que aceptan.

   La justificación intuitiva es que una función es un subtipo de otra si puede dar más garantías (un valor de retorno más específico)
   o necesita menos requerimientos para ser llamada (parámetros más laxos).
   Dicho de otra forma: siempre puedes tener menos precondiciones (los parámetros) o más poscondiciones (el valor de retorno).
    
   Varianza en los return types:

  Invariante:     Dog < Animal -> () => Dog y () => Animal no son compatibles 😕 
  Covariante:     Dog < Animal -> () => Dog < () => Animal ✅
  Contravariante: Dog < Animal -> () => Dog > () => Animal ❌ 
  Bivariante:     Dog < Animal -> () => Dog < > () => Animal ❌

  Varianza en los parameter types:

  Invariante:     Dog < Animal -> (Dog => _) y (Animal => _) no son compatibles 😕 
  Covariante:     Dog < Animal -> (Dog => _) < (Animal => _) ❌
  Contravariante: Dog < Animal -> (Dog => _) > (Animal => _) ✅ En TS, sólo cuando --strictFunctionTypes es true 
  Bivariante:     Dog < Animal -> (Dog => _) < > (Animal => _) ❌ Comportamiento normal de TS

  En general, podemos hablar de tipos genéricos en términos de si son "productores" o "consumidores" de otros tipos.
  
  Productores: tipos de datos inmutables (ReadonlyArray), sólo vamos a leer su contenido. 
               También funciones que producen un output.
               Covariantes ✅ 
  Consumidores: tipos de datos MUTABLES que van a aceptar valores.
               También funciones que reciben parámetros como input.
               Invariantes o contravariantes ✅ 

 */
