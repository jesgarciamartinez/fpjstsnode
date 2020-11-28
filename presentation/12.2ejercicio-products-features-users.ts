export type Product = {
  id: string
  users: User[]
  features: Feature[]
}

export type UserRole =
  | 'freeCustomer'
  | 'paidCustomer'
  | 'enterpriseCustomer'
  | 'admin'

export type User = {
  id: string
  name: string
  age: number
  signUpDate: Date
  role: UserRole
}

export type Feature = {
  id: string
  productId: string
  description: string
  deployStatus: 'dev' | 'pre' | 'pro'
  accesibleToUserRoles: Set<UserRole>
}

/* 1. A partir de un Array de Product, obtén los totales y listas de usuarios por cada UserRole */
/* 2. A partir de un Array de Product, obtén los totales y listas de usuarios por franja de edad, distinguiendo  U < 20,  20 <= U <= 30, y U > 30 */
/* 3. A partir de un Array de Product, obtén una lista de usuarios que tienen más de un producto */
/* 4. A partir de un Array de Product, obtén una lista de Features que estén en 'pro' y sean de pago (disponibles sólo para paidCustomer y enterpriseCustomer) */

declare const currentUserRole: UserRole

/* 5. Asumiendo que tenemos una variable currentUserRole, y queremos realizar la operación dangerousOperation sólo cuando currentUserRole es 'admin',
      ¿cómo harías que esta operación fuera segura en tiempo de compilación?
*/
/* 6. Asumiendo que tenemos una variable currentUserRole, queremos que avanzar el status de una Feature sólo pueda hacerlo un usuario admin
      y siguiendo el orden implícito en dev -> pre -> pro. ¿Cómo podríamos asegurarnos de esto en tiempo de compilación?
 */

/* 8. Supongamos que queremos modificar el modelo para incluir la nacionalidad de los usuarios (EU o US) 
      y la cantidad que pagan:
     Los usuarios "paidCustomer" pagan 100€ o 100$, los "enterpriseCustomer" 1000€ o 1000$ y los demás 0€ o 0$. 
*/
/* 9. Con los cambios anteriores, queremos calcular el beneficio total en € y $ de una lista de productos */
/* 10. Con los cambios anteriores, queremos calcular obtener el/los productos con más usuarios de cada nacionalidad */

/* Soluciones */

import { pipe, flow } from './11.1fp-ts-pipe'
import { flatMap, prop, reduce } from './12.3utils'
import type { F1 } from './12.3utils'

/* 1. */

type UsersByRole = Record<
  UserRole,
  {
    total: number
    users: User[]
  }
>

const getUniqueArrayByProp = <A, K extends keyof A>(prop: K) => (
  as: A[],
): A[] => as.filter((a, i) => as.findIndex(a_ => a[prop] === a_[prop]) === i)

function productArrayToUsersByRole(products: Product[]): UsersByRole {
  return pipe(
    products,
    flatMap(prop('users')),
    getUniqueArrayByProp('id'),
    reduce(
      (acc, user) => {
        acc[user.role].total += 1
        acc[user.role].users.push(user)
        return acc
      },
      <UsersByRole>{
        freeCustomer: { total: 0, users: [] },
        paidCustomer: { total: 0, users: [] },
        enterpriseCustomer: { total: 0, users: [] },
        admin: { total: 0, users: [] },
      },
    ),
  )
}

const usersToUsersByRole: F1<User[], UsersByRole> = reduce(
  (acc, user) => {
    acc[user.role].total += 1
    acc[user.role].users.push(user)
    return acc
  },
  <UsersByRole>{
    freeCustomer: { total: 0, users: [] },
    paidCustomer: { total: 0, users: [] },
    enterpriseCustomer: { total: 0, users: [] },
    admin: { total: 0, users: [] },
  },
)

const productsToUniqueUsers: F1<Product[], User[]> = flow(
  flatMap(prop('users')),
  getUniqueArrayByProp('id'),
)

const productArrayToUsersByRole_2: F1<Product[], UsersByRole> = flow(
  productsToUniqueUsers,
  usersToUsersByRole,
)

/* 2. A partir de un Array de Product, obtén los totales y listas de usuarios por franja de edad, distinguiendo  U < 20,  20 <= U <= 30, y U > 30 */

type AgeRanges = 'under20' | '20to30' | 'over30'
type UsersByAgeRange = Record<AgeRanges, { total: number; users: User[] }>

const productArrayToUsersAgeRange: F1<Product[], UsersByAgeRange> = flow(
  productsToUniqueUsers,
  reduce(
    (acc, user) => {
      const ageRange: AgeRanges =
        user.age < 20 ? 'under20' : user.age > 30 ? 'over30' : '20to30'

      acc[ageRange].total += 1
      acc[ageRange].users.push(user)
      return acc
    },
    <UsersByAgeRange>{
      under20: { total: 0, users: [] },
      '20to30': { total: 0, users: [] },
      over30: { total: 0, users: [] },
    },
  ),
)
