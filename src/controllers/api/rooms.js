const Room = require('../../models').room
const Guest = require('../../models').guest
const Session = require('../../models').session
const responses = require('../../constants/responses')
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const { Op } = require('sequelize')
// const QRCode = require('qrcode')
const ejs = require('ejs')
const emailQueue = require('../../queue/email-queue')
const { ejsViewPath } = require('../../utils/ejs-util')
const { resendVerifiedDomain } = require('../../utils/resend')

async function getRoomPagination (req, res) {
  try {
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit

    const totalRooms = await Room.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`
            }
          },
          {
            description: {
              [Op.like]: `%${search}%`
            }
          }
        ]
      }
    })

    const rooms = await Room.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`
            }
          },
          {
            description: {
              [Op.like]: `%${search}%`
            }
          }
        ]
      },
      limit: currentLimit,
      offset
    })

    const totalPages = Math.ceil(parseInt(totalRooms) / parseInt(currentLimit))

    const data = {
      rooms,
      total: totalRooms,
      limit: currentLimit,
      page: currentPage,
      totalPages
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Rooms retrieved successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function getRoom (req, res) {
  try {
    const { id } = req.params
    const room = await Room.findByPk(id)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const data = {
      room
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Room retrieved successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function addRoom (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { name, description } = req.body
      const newRoom = await Room.create({
        name,
        description
      })

      const data = {
        room: newRoom
      }

      return responseMaker(res, data, {
        ...responses.created,
        message: 'Room created'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function updateRoom (req, res) {
  try {
    validationResponseMaker(req, res, async () => {
      const { id } = req.params
      const { name, description } = req.body
      const room = await Room.findByPk(id)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      await room.update({
        name,
        description
      })

      const data = {
        room
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Room updated'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function deleteRoom (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { id } = req.params
      const room = await Room.findByPk(id)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      await Guest.destroy({
        where: {
          roomId: id
        }
      })
      await Session.destroy({
        where: {
          roomId: id
        }
      })
      await room.destroy()

      const data = {
        room
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Room deleted'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function sendRoomQRCodeMail (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId } = req.params
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const guests = await Guest.findAll({
        roomId
      })

      if (guests.length === 0) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Guests not found'
        })
      }

      const mailPromises = guests.map(async (guest) => ({
        from: `Siensi <siensi@${resendVerifiedDomain}>`,
        to: [guest.email],
        subject: 'Presence QR Code',
        html: await ejs.renderFile(ejsViewPath('mail'), {
          guestName: guest.name,
          roomName: room.name,
          qrCode: `https://barcode.orcascan.com?type=qr&data=${guest.key}&format=png`
        })
        // attachments: [{
        //   filename: 'qrcode.png',
        //   content: (await QRCode.toBuffer(guest.key, { errorCorrectionLevel: 'H', width: 300, margin: 2 })).toString('base64')
        // }]
      }))

      const mailResults = await Promise.all(mailPromises)

      mailResults.forEach(mail => {
        emailQueue.add({
          ...mail
        })
      })

      return responseMaker(res, null, {
        ...responses.success,
        message: 'Success to send QR code to email'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function sendGuestQRCodeMail (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId, guestId } = req.params
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const guest = await Guest.findByPk(guestId)

      if (!guest) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Guest not found'
        })
      }

      const mailPromise = async (guest) => ({
        from: `Siensi <siensi@${resendVerifiedDomain}>`,
        to: [guest.email],
        subject: 'Presence QR Code',
        html: await ejs.renderFile(ejsViewPath('mail'), {
          guestName: guest.name,
          roomName: room.name,
          qrCode: `https://barcode.orcascan.com?type=qr&data=${guest.key}&format=png`
        })
        // attachments: [{
        //   filename: 'qrcode.png',
        //   content: (await QRCode.toBuffer(guest.key, { errorCorrectionLevel: 'H', width: 300, margin: 2 })).toString('base64')
        // }]
      })

      const mailData = await mailPromise(guest)

      emailQueue.add({
        ...mailData
      })

      return responseMaker(res, null, {
        ...responses.success,
        message: 'Success to send QR code to email'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  getRoomPagination,
  getRoom,
  addRoom,
  sendRoomQRCodeMail,
  sendGuestQRCodeMail,
  updateRoom,
  deleteRoom
}
