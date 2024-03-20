const { param, body } = require('express-validator')
const Room = require('../models').room

const createRoomValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('description').notEmpty().withMessage('description is required'),
  body('description').isLength({ max: 3000 }).withMessage('description is too long')
]

const updateRoomValidator = [
  param('id').custom(async (value) => {
    const room = await Room.findByPk(value)
    if (!room) {
      throw new Error('room not found')
    }
  }),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('description').notEmpty().withMessage('description is required'),
  body('description').isLength({ max: 3000 }).withMessage('description is too long')
]

const deleteRoomValidator = [
  param('id').custom(async (value) => {
    const room = await Room.findByPk(value)
    if (!room) {
      throw new Error('room not found')
    }
  })
]

module.exports = {
  createRoomValidator,
  updateRoomValidator,
  deleteRoomValidator
}
