const { generateAccessToken, generateRefreshToken } = require('../utils/token-manager')
const appConfig = require('../config')
const bcrypt = require('bcryptjs')

function responseMaker (res, data, response, config = {
  includeJwt: false,
  includeRefreshToken: false,
  accessTokenData: {},
  refreshTokenData: {}
}) {
  let objectResponse = {
    status: response.code,
    message: response.message,
    data
  }

  if (config.includeJwt) {
    const accessToken = generateAccessToken(config.accessTokenData)
    objectResponse = {
      status: objectResponse.status,
      message: objectResponse.message,
      accessToken,
      data
    }

    if (config.includeRefreshToken) {
      const refreshToken = generateRefreshToken({
        signature: bcrypt.hashSync(appConfig.keySignature, 8),
        ...config.refreshTokenData
      })
      objectResponse = {
        status: objectResponse.status,
        message: objectResponse.message,
        accessToken,
        refreshToken,
        data
      }
    }
  }

  return res.status(response.code).json(objectResponse)
}

module.exports = responseMaker
