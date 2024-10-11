const { getEnv } = require('../utils/env-util')
const path = require('path')

module.exports = {
  appKey: getEnv('APP_KEY'),
  keySignature: getEnv('APP_SIGNATURE'),
  storagePath: path.resolve(__dirname, '../../storage'),
  keyExpirationTime: 5 * 60, // expires in 5 minutes
  disableKeyExpiration: false
}
