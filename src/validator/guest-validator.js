const { body, check } = require('express-validator')
const Room = require('../models').room
const Guest = require('../models').guest

const createRoomGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('key').notEmpty().withMessage('key is required'),
  body('key').isLength({ max: 30 }).withMessage('key is too long'),
  body('gender').notEmpty().withMessage('gender is required'),
  body('gender').isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('email').optional().isEmail().withMessage('email is not valid'),
  body('email').optional().isLength({ max: 255 }).withMessage('email is too long'),
  body('phone').optional().isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['roomId', 'key']).custom(async (value, { path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'key') {
      const guest = await Guest.findOne({ where: { key: value } })
      if (guest) {
        throw new Error('key already exists')
      }
    }
  })
]

const updateRoomGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('key').notEmpty().withMessage('key is required'),
  body('key').isLength({ max: 30 }).withMessage('key is too long'),
  body('gender').notEmpty().withMessage('gender is required'),
  body('gender').isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('email').optional().isEmail().withMessage('email is not valid'),
  body('email').optional().isLength({ max: 255 }).withMessage('email is too long'),
  body('phone').optional().isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['roomId', 'guestId', 'key']).custom(async (value, { req, path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'guestId') {
      const guest = await Guest.findByPk(value)
      if (!guest) {
        throw new Error('guest not found')
      }
    }

    if (path === 'key') {
      const guest = await Guest.findOne({ where: { key: value } })
      if (guest.id !== req.params.guestId) {
        throw new Error('key already exists')
      }
    }
  })
]

const deleteRoomGuestValidator = [
  check(['roomId', 'guestId']).custom(async (value, { path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'guestId') {
      const guest = await Guest.findByPk(value)
      if (!guest) {
        throw new Error('guest not found')
      }
    }
  })
]

module.exports = {
  createRoomGuestValidator,
  updateRoomGuestValidator,
  deleteRoomGuestValidator
}
