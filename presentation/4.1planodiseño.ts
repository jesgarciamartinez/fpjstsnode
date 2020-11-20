/* 
  Linus Torvalds: “Bad programmers worry about the code. Good
  programmers worry about data and their relationships.” 
 */

type Product = {
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

function program(products: Product[]): NumberOfUsersByRole {
  let result = {
    freeCustomer: 0,
    paidCustomer: 0,
    enterpriseCustomer: 0,
    admin: 0,
  }
  if (products.length === 0) {
    return result
  }
  const userIds = new Set()
  products.forEach(product => {
    product.users.forEach(user => {
      if (userIds.has(user.id)) return
      result[user.role] += 1
      userIds.add(user.id)
    })
  })
  return result
}
