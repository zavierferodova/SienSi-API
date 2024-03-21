require('dotenv').config()
const path = require('path')

module.exports = {
  appKey: process.env.APP_KEY,
  keySignature: process.env.APP_SIGNATURE,
  storagePath: path.resolve(__dirname, '../../storage'),
  keyExpirationTime: 5 * 60, // expires in 5 minutes
  disableKeyExpiration: false
}
