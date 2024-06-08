const { Router } = require('express')
const verifyJwtToken = require('../middlewares/verify-jwt-token.js')
const { getUser } = require('../controllers/api/users.js')
const { loginValidator } = require('../validator/auth-validator.js')
const {
  createGuestValidator,
  updateGuestValidator
} = require('../validator/guest-validator.js')
const {
  login,
  updateAccessToken
} = require('../controllers/api/auth.js')
const {
  getGuest,
  getGuestPagination,
  addGuest,
  updateGuest,
  deleteGuest,
  generateGuestQRCodeKey
} = require('../controllers/api/guests.js')
const {
  getGuestPresencePagination,
  guestPresence,
  clearAttendances,
  generateExcelAttendances
} = require('../controllers/api/presence.js')

const router = Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the SienSi API'
  })
})

// router.post('/auth/register', register)
router.post('/auth/login', loginValidator, login)
router.post('/token/update', updateAccessToken)

router.get('/user/:id', [verifyJwtToken], getUser)

router.get('/guest/:guestId', [verifyJwtToken], getGuest)
router.get('/guest', [verifyJwtToken], getGuestPagination)
router.post('/guest', [verifyJwtToken, ...createGuestValidator], addGuest)
router.put('/guest/:guestId', [verifyJwtToken, ...updateGuestValidator], updateGuest)
router.delete('/guest/:guestId', [verifyJwtToken], deleteGuest)
router.get('/guest/:guestId/qrkey', [verifyJwtToken], generateGuestQRCodeKey)

router.get('/presence', [verifyJwtToken], getGuestPresencePagination)
router.post('/presence', [verifyJwtToken], guestPresence)
router.delete('/presence', [verifyJwtToken], clearAttendances)
router.get('/presence/export-excel', [verifyJwtToken], generateExcelAttendances)

module.exports = router
