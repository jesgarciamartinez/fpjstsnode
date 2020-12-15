/* ¿Qué hace este programa? */

function program(products) {
  const result = {
    freeCustomer: 0,
    paidCustomer: 0,
    enterpriseCustomer: 0,
    adminCustomer: 0,
  }
  if (products.length === 0) {
    return result
  }
  const userIds = new Set()
  products.forEach(product => {
    product.users.forEach(user => {
      if (userIds.has(user.id)) {
        return
      }
      result[user.role] += 1
      userIds.add(user.id)
    })
  })
  return result
}
