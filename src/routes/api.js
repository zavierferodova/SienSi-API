const { Router } = require('express')
const verifyJwtToken = require('../middlewares/verify-jwt-token.js')
const { getUser } = require('../controllers/api/users.js')
const { loginValidator } = require('../validator/auth-validator.js')
const {
  createRoomValidator,
  updateRoomValidator
} = require('../validator/room-validator.js')
const {
  createRoomGuestValidator,
  updateRoomGuestValidator
} = require('../validator/guest-validator.js')
const {
  createRoomSessionValidator,
  updateRoomSessionValidator
} = require('../validator/session-validator.js')
const {
  login,
  updateAccessToken
} = require('../controllers/api/auth.js')
const {
  getRoom,
  getRoomPagination,
  addRoom,
  updateRoom,
  deleteRoom,
  sendRoomQRCodeMail,
  sendGuestQRCodeMail
} = require('../controllers/api/rooms.js')
const {
  getRoomGuest,
  getRoomGuestPagination,
  addRoomGuest,
  updateRoomGuest,
  deleteRoomGuest,
  generateGuestQRCodeKey
} = require('../controllers/api/guests.js')
const {
  getRoomSession,
  getRoomSessionPagination,
  addRoomSession,
  updateRoomSession,
  deleteRoomSession,
  getGuestPresencePagination,
  guestPresence,
  generateExcelSessionAttendances
} = require('../controllers/api/sessions.js')
const { mainInsights, topRoomWithGuests, topRoomWithAttendances } = require('../controllers/api/dashboard.js')

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

router.get('/dashboard/main', [verifyJwtToken], mainInsights)
router.get('/dashboard/top-guest-room', [verifyJwtToken], topRoomWithGuests)
router.get('/dashboard/top-attendance-room', [verifyJwtToken], topRoomWithAttendances)

router.get('/room/:id', [verifyJwtToken], getRoom)
router.get('/room', [verifyJwtToken], getRoomPagination)
router.post('/room', [verifyJwtToken, ...createRoomValidator], addRoom)
router.put('/room/:id', [verifyJwtToken, ...updateRoomValidator], updateRoom)
router.delete('/room/:id', [verifyJwtToken], deleteRoom)

router.get('/room/:roomId/guest/:guestId', [verifyJwtToken], getRoomGuest)
router.get('/room/:roomId/guest', [verifyJwtToken], getRoomGuestPagination)
router.post('/room/:roomId/guest', [verifyJwtToken, ...createRoomGuestValidator], addRoomGuest)
router.put('/room/:roomId/guest/:guestId', [verifyJwtToken, ...updateRoomGuestValidator], updateRoomGuest)
router.delete('/room/:roomId/guest/:guestId', [verifyJwtToken], deleteRoomGuest)
router.get('/room/:roomId/guest/:guestId/qrkey', [verifyJwtToken], generateGuestQRCodeKey)
router.post('/room/:roomId/guest/:guestId/send-qrcode', [verifyJwtToken], sendGuestQRCodeMail)

router.get('/room/:roomId/session/:sessionId', [verifyJwtToken], getRoomSession)
router.get('/room/:roomId/session', [verifyJwtToken], getRoomSessionPagination)
router.post('/room/:roomId/session', [verifyJwtToken, ...createRoomSessionValidator], addRoomSession)
router.post('/room/:roomId/send-all-qrcode', [verifyJwtToken], sendRoomQRCodeMail)
router.put('/room/:roomId/session/:sessionId', [verifyJwtToken, ...updateRoomSessionValidator], updateRoomSession)
router.delete('/room/:roomId/session/:sessionId', [verifyJwtToken], deleteRoomSession)
router.get('/room/:roomId/session/:sessionId/presence', [verifyJwtToken], getGuestPresencePagination)
router.post('/room/:roomId/session/:sessionId/presence', [verifyJwtToken], guestPresence)
router.get('/room/:roomId/session/:sessionId/excel', [verifyJwtToken], generateExcelSessionAttendances)

module.exports = router
