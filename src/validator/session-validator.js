const { param, body, check } = require('express-validator')
const Room = require('../models').room
const Session = require('../models').session
const Guest = require('../models').guest
const { Op } = require('sequelize')

const createRoomSessionValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('allowPresence').optional().isBoolean().withMessage('allowPresence accept boolean only'),
  param('roomId').custom(async (value) => {
    const room = await Room.findByPk(value)
    if (!room) {
      throw new Error('room not found')
    }
  })
]

const updateRoomSessionValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('name').isLength({ max: 80 }).withMessage('name is too long'),
  body('allowPresence').optional().isBoolean().withMessage('allowPresence accept boolean only'),
  check(['roomId', 'sessionId']).custom(async (value, { path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'sessionId') {
      const guest = await Session.findByPk(value)
      if (!guest) {
        throw new Error('session not found')
      }
    }
  })
]

const deleteRoomSessionValidator = [
  check(['roomId', 'sessionId']).custom(async (value, { path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'sessionId') {
      const guest = await Session.findByPk(value)
      if (!guest) {
        throw new Error('session not found')
      }
    }
  })
]

const guestPresenceValidator = [
  check(['roomId', 'sessionId', 'guestKey']).custom(async (value, { req, path }) => {
    if (path === 'roomId') {
      const room = await Room.findByPk(value)
      if (!room) {
        throw new Error('room not found')
      }
    }

    if (path === 'sessionId') {
      const guest = await Session.findByPk(value)
      if (!guest) {
        throw new Error('session not found')
      }
    }

    if (path === 'guestKey') {
      const guest = await Guest.findOne({
        [Op.and]: {
          roomId: req.params.roomId,
          key: value
        }
      })
      if (!guest) {
        throw new Error('guest not found')
      }
    }
  })
]

module.exports = {
  createRoomSessionValidator,
  updateRoomSessionValidator,
  deleteRoomSessionValidator,
  guestPresenceValidator
}
