export type Product = {
  id: string
  users: User[]
  features: Feature[]
}

type User = {
  id: string
  name: string
  age: number
  signUpDate: Date
  role: UserRole
}

type UserRole = 'freeCustomer' | 'paidCustomer' | 'enterpriseCustomer' | 'admin'

type Feature = {
  id: string
  description: string
  deployStatus: 'dev' | 'pre' | 'pro'
  accesibleToUserRoles: Set<UserRole>
}
/* In the following exercises, practice thinking of the types of the functions you need before implementing them (type-first development) */

/* 1. Take an Array of Product and get the total number and lists of users for every UserRole */
/* 2. Take an Array of Product and get the total number and lists of users for the following age ranges: U < 20,  20 <= U <= 30, y U > 30 */
/* 3. Take an Array of Product and get a list of users with more than one product */
/* 4. Take an Arary of Product and get a list of Features that are in 'pro' and paid (available only for paidCustomer and enterpriseCustomer) */

declare const currentUserRole: UserRole

/* 5. Assuming we have a currentUserRole variable and we want to do dangerousOperation only when currentUserRole is 'admin',
      how would you ensure this condition is met in compile-time?
*/

/* 6. Assuming we have a currentUserRole variable and we want to advance the `status` of a Feature only if it's 'admin'
      and following the implicit order in dev -> pre -> pro, how could we be sure of this at compile-time?
 */

/* Solutions */

import { pipe, flow } from './10fp-ts-pipe'
import { flatMap, prop, reduce } from './12.2utils'
import type { F1 } from './12.2utils'

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

/* How could we capture the invariant that User[] needs to be an array of _unique_ users? */

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

const productArrayToUsersByRole_2: F1<Product[], UsersByRole> = flow(
  flatMap(prop('users')),
  getUniqueArrayByProp('id'),
  usersToUsersByRole,
)
