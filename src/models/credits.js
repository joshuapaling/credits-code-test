const savedData = require('../data/credits.json')

// We don't want to make candidates set up postgres, so just use
// a simple in-memory "database". There's no expectation that changes
// to this "database" are persisted once the app shuts down!
let inMemoryDB = []

const truncate = () => {
  inMemoryDB = []
}

const loadSavedData = () => {
  inMemoryDB = savedData
}

const create = (row) => {
  inMemoryDB.push(row)
}

const findAll = (user) => {
  return inMemoryDB
}

const findByUser = (user) => {
  return inMemoryDB.filter(row => row.user === user)
}

const balance = (user) => {
  return findByUser(user).reduce((sum, row) => sum + row.amount, 0)
}

module.exports = {
  truncate,
  loadSavedData,
  create,
  findAll,
  findByUser,
  balance,
}
