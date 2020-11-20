/*
 *
 * Ejemplos de composicionalidad
 *
 */

/* Sumas, restas, multiplicaciones de números */

const one: number = 1
const two: number = 2
const three: number = 3

1 + (2 + 3) === 1 * 2 * 3

/* ¡Pero no división! */

1 / 0 //-> NaN

/* String methods */

const myString: string = 'La composicionalidad está muy bien '
  .trim()
  .toUpperCase()

/* Booleans */

const t: boolean = true
const f: boolean = false

;(t && f) || (t && f)
