const { body } = require('express-validator')

const createRoomValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('description').notEmpty().withMessage('description is required'),
  body('description').isLength({ max: 3000 }).withMessage('description is too long')
]

const updateRoomValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('description').notEmpty().withMessage('description is required'),
  body('description').isLength({ max: 3000 }).withMessage('description is too long')
]

module.exports = {
  createRoomValidator,
  updateRoomValidator
}
