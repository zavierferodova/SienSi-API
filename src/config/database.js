const path = require('path')
const { getEnv } = require('../utils/env-util')

const databasePath = path.join(__dirname, `../../db/${getEnv('DB_NAME')}`)

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
