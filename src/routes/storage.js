const { Router } = require('express')
const verifyJwtToken = require('../middlewares/verify-jwt-token.js')
const { uploadGuestProfileImageMiddleware } = require('../middlewares/upload-guest-profile-image.js')
const {
  getGuestImageFile,
  uploadGuestProfileImage
} = require('../controllers/api/guests.js')

const router = Router()

router.get('/guest/image/:filename', getGuestImageFile)
router.post('/guest/image', [verifyJwtToken, uploadGuestProfileImageMiddleware], uploadGuestProfileImage)

module.exports = router
