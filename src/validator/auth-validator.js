const User = require('../models').user
const { body } = require('express-validator')

const registerValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('invalid email address'),
  body('email').custom(async (value) => {
    const user = await User.findOne({
      where: {
        email: value
      }
    })

    if (user) {
      throw new Error('email already exists')
    }
  }),
  body('password').notEmpty().withMessage('password is required'),
  body('password').isLength({ min: 4 }).withMessage('password must be at least 4 characters long')
]

const loginValidator = [
  body('email').notEmpty().withMessage('email is required'),
  body('email').isEmail().withMessage('invalid email address'),
  body('password').notEmpty().withMessage('password is required'),
  body('password').isLength({ min: 4 }).withMessage('password must be at least 4 characters long')
]

module.exports = {
  registerValidator,
  loginValidator
}
