const jwt = require('jsonwebtoken')
const appConfig = require('../config')

function generateAccessToken (data) {
  if (data == null) {
    data = {}
  }
  if (appConfig.disableKeyExpiration) {
    return `Bearer ${jwt.sign(data, appConfig.appKey)}`
  }
  return `Bearer ${jwt.sign(data, appConfig.appKey, {
        expiresIn: appConfig.keyExpirationTime
      })}`
}

function generateRefreshToken (data) {
  if (data == null) {
    data = {}
  }
  return `Bearer ${jwt.sign(data, appConfig.appKey)}`
}

function verifyToken (token) {
  let data = null
  jwt.verify(token, appConfig.appKey, (err, decoded) => {
    if (err) {
      throw Error('Invalid token')
    }
    data = decoded
  })
  return data
}

function splitToken (token) {
  const [format, tokenValue] = token.split(' ')
  return {
    format,
    token: tokenValue
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  splitToken
}
