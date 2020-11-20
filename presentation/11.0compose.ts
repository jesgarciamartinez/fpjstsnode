/* 
Composición de funciones: podemos componer dos funciones en las que el tipo de salida de una sea el de entrada de la otra

Si g es una función A -> B y f es una función B -> C

A ---g--> B ---f--> C

A ---f . g --> C

*/

/* compose :: (B -> C) -> (A -> B) -> A -> C */
const compose = (f, g) => x => f(g(x))
// const flow = (f, g) => x => g(f(x))

/* Implementa la función compose variádica, que toma cualquier número de funciones y las compone de derecha a izquierda */

/* Implementa la función flow variádica, que toma cualquier número de funciones y las compone de izquierda a derecha */
