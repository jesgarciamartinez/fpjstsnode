/* Transformando código de bajo nivel en utilidades funcionales */

type Person = {
  name: string
  age: number
}

const people: Person[] = [
  { name: 'Marcos', age: 3 },
  { name: 'Laura', age: 27 },
  { name: 'Luis', age: 38 },
  { name: 'Javi', age: 29 },
]

/* Transformar un array en otro */

const ages = []
for (let i = 0; i < people.length; i++) {
  const currentPerson = people[i]
  ages.push(currentPerson.age)
}

console.log(ages) //-> [3,27,38,29]

export const map = <A, B>(f: (_: A) => B, as: A[]): B[] => {
  const result = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i]
    result.push(f(element))
  }
  return result
}

const ages2 = map(({ age }) => age, people)
console.log(ages2) //-> [3,27,38,29]

/* Descartar algunos elementos de un array */

const adults = []
for (let i = 0; i < people.length; i++) {
  const currentPerson = people[i]
  if (currentPerson.age > 18) {
    adults.push(currentPerson)
  }
}

console.log(adults) //->   [{ name: 'Laura', age: 27 }, { name: 'Luis', age: 38 }, { name: 'Javi', age: 29 }]

export function filter<A>(f: (_: A) => boolean, as: A[]): A[] {
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

const isAdult = (x: Person): boolean => x.age > 18
const adults2 = filter(isAdult, people)
console.log(adults2) //->   [{ name: 'Laura', age: 27}, { name: 'Luis', age: 38 }, { name: 'Javi', age: 29 }]

// const isAdult2 = (person: Person): person is Adult => person.age > 18

/* Convertir un array a cualquier otro tipo de dato */

let totalAge = 0
for (let i = 0; i < people.length; i++) {
  const currentPerson = people[i]
  totalAge += currentPerson.age
}

console.log(totalAge) //-> 97

export function reduce<A, ACC>(
  f: (acc: ACC, v: A) => ACC,
  acc: ACC,
  as: A[],
): ACC {
  let result: ACC = acc
  for (let i = 0; i < as.length; i++) {
    const a = as[i]
    result = f(result, a)
  }
  return result
}

const totalAge2 = reduce(
  (acc, { age }) => {
    return acc + age // ACC
  },
  0,
  people,
)
console.log(totalAge2) //-> 97
