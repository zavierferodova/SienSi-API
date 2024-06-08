const { body, check } = require('express-validator')
const Guest = require('../models').guest

const createGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('key').notEmpty().withMessage('key is required'),
  body('key').isLength({ max: 30 }).withMessage('key is too long'),
  body('gender').notEmpty().withMessage('gender is required'),
  body('gender').isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('email is not valid'),
  body('email').optional().isLength({ max: 255 }).withMessage('email is too long'),
  body('phone').optional({ checkFalsy: true }).isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['key']).custom(async (value, { req, path }) => {
    if (path === 'key') {
      const guestId = req.params.guestId
      const guest = await Guest.findOne({
        where: {
          key: value
        }
      })

      if (guest && guest.id !== guestId) {
        throw new Error('key already exists')
      }
    }
  })
]

const updateGuestValidator = [
  body('photo').optional().isLength({ max: 255 }).withMessage('photo is too long'),
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('key').notEmpty().withMessage('key is required'),
  body('key').isLength({ max: 30 }).withMessage('key is too long'),
  body('gender').notEmpty().withMessage('gender is required'),
  body('gender').isIn(['male', 'female']).withMessage('gender is not recognized'),
  body('address').isLength({ max: 255 }).withMessage('address is too long'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('email is not valid'),
  body('email').optional().isLength({ max: 255 }).withMessage('email is too long'),
  body('phone').optional({ checkFalsy: true }).isNumeric().withMessage('phone allow number only'),
  body('phone').optional().isLength({ max: 20 }).withMessage('phone is too long'),
  check(['key']).custom(async (value, { req, path }) => {
    if (path === 'key') {
      const guestId = req.params.guestId
      const guest = await Guest.findOne({
        where: {
          key: value
        }
      })

      if (guest && guest.id !== guestId) {
        throw new Error('key already exists')
      }
    }
  })
]

module.exports = {
  createGuestValidator,
  updateGuestValidator
}
