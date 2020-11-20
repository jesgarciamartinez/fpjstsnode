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

type NumberOfUsersByRole = {
  [key in UserRole]: number
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
