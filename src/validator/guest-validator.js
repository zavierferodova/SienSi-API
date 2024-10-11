const { body, check } = require('express-validator')
const Guest = require('../models').guest
const { Op } = require('sequelize')

const createRoomGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('key').notEmpty().withMessage('key is required'),
  body('key').isLength({ max: 30 }).withMessage('key is too long'),
  body('email').notEmpty().withMessage('email is required'),
  body('email').isEmail().withMessage('email is not valid'),
  body('email').isLength({ max: 255 }).withMessage('email is too long'),
  body('gender').notEmpty().withMessage('gender is required'),
  body('gender').isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('phone').optional().isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['roomId', 'key']).custom(async (value, { req, path }) => {
    if (path === 'key') {
      const roomId = req.params.roomId
      const guest = await Guest.findOne({
        where: {
          [Op.and]: {
            roomId,
            key: value
          }
        }
      })

      if (guest) {
        throw new Error('key already exists')
      }
    }
  })
]

const updateRoomGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').optional().isLength({ max: 80 }).withMessage('name is too long'),
  body('key').optional().isLength({ max: 30 }).withMessage('key is too long'),
  body('email').optional().isEmail().withMessage('email is not valid'),
  body('email').isLength({ max: 255 }).withMessage('email is too long'),
  body('gender').optional().isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('phone').optional().isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['roomId', 'key']).custom(async (value, { req, path }) => {
    if (path === 'key' && value) {
      const roomId = req.params.roomId
      const guestId = req.params.guestId
      const guest = await Guest.findOne({
        where: {
          [Op.and]: {
            roomId,
            key: value
          }
        }
      })

      if (guest && guest.id !== guestId) {
        throw new Error('key already exists')
      }
    }
  })
]

module.exports = {
  createRoomGuestValidator,
  updateRoomGuestValidator
}
