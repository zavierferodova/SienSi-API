require('dotenv').config()
const path = require('path')

const databasePath = path.join(__dirname, `../../db/${process.env.DB_NAME}`)

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: databasePath
  },
  test: {
    dialect: 'sqlite',
    storage: databasePath
  },
  production: {
    dialect: 'sqlite',
    storage: databasePath
  }
}
