require('dotenv').config()

const getEnv = (name) => {
  const value = process.env[name]

  if (!value) {
    return ''
  }

  return value
}

module.exports = {
  getEnv
}
