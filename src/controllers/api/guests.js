const Guest = require('../../models').guest
const Room = require('../../models').room
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')
const { Op } = require('sequelize')
const { guestImageStoragePath } = require('../../middlewares/upload-guest-profile-image')
const fs = require('fs')

async function getRoomGuestPagination (req, res) {
  try {
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit

    const { roomId } = req.params
    const room = await Room.findByPk(roomId)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const totalGuests = await Guest.count({
      where: {
        [Op.and]: [
          {
            roomId
          },
          {
            [Op.or]: [
              {
                key: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                name: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                gender: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                address: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                email: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                phone: {
                  [Op.like]: `%${search}%`
                }
              }
            ]
          }
        ]
      }
    })

    const guests = await Guest.findAll({
      limit: currentLimit,
      offset,
      where: {
        [Op.and]: [
          {
            roomId
          },
          {
            [Op.or]: [
              {
                key: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                name: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                gender: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                address: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                email: {
                  [Op.like]: `%${search}%`
                }
              },
              {
                phone: {
                  [Op.like]: `%${search}%`
                }
              }
            ]
          }
        ]
      }
    })

    const totalPages = Math.ceil(parseInt(totalGuests) / parseInt(currentLimit))

    const data = {
      guests,
      total: totalGuests,
      limit: currentLimit,
      page: currentPage,
      totalPages
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Guests found'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function getRoomGuest (req, res) {
  try {
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

    const data = {
      guest
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Guest found'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function addRoomGuest (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId } = req.params
      const {
        key,
        photo = null,
        name,
        gender,
        address = null,
        email = null,
        phone = null
      } = req.body
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const guest = await Guest.create({
        roomId,
        key,
        photo,
        name,
        gender,
        address,
        email,
        phone
      })

      const data = {
        guest
      }

      return responseMaker(res, data, {
        ...responses.created,
        message: 'Guest created'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function updateRoomGuest (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId, guestId } = req.params
      const {
        key,
        photo,
        name,
        gender,
        address,
        email,
        phone
      } = req.body
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

      await guest.update({
        key,
        photo,
        name,
        gender,
        address,
        email,
        phone
      })

      const data = {
        guest
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Guest updated'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function deleteRoomGuest (req, res) {
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

      await guest.destroy()

      const data = {
        guest
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Guest deleted'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function getGuestImageFile (req, res) {
  try {
    const { filename } = req.params
    const filePath = `${guestImageStoragePath}/${filename}`

    if (!fs.existsSync(filePath)) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'File not found'
      })
    }

    return res.sendFile(filePath)
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function uploadGuestProfileImage (req, res) {
  try {
    if (!req.file) {
      return responseMaker(res, null, {
        ...responses.badRequest,
        message: 'No file uploaded'
      })
    }

    const data = {
      filename: req.file.filename
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Image uploaded'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  getRoomGuest,
  getRoomGuestPagination,
  addRoomGuest,
  updateRoomGuest,
  deleteRoomGuest,
  getGuestImageFile,
  uploadGuestProfileImage
}
