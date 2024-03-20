const { body } = require('express-validator')

const createRoomSessionValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('allowPresence').optional().isBoolean().withMessage('allowPresence accept boolean only')
]

const updateRoomSessionValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('allowPresence').optional().isBoolean().withMessage('allowPresence accept boolean only')
]

module.exports = {
  createRoomSessionValidator,
  updateRoomSessionValidator
}
