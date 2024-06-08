const Guest = require('../../models').guest
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')
const { Op } = require('sequelize')
const { guestImageStoragePath } = require('../../middlewares/upload-guest-profile-image')
const fs = require('fs')
const QRCode = require('qrcode')

async function getGuestPagination (req, res) {
  try {
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit

    const totalGuests = await Guest.count({
      where: {
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
    })

    const guests = await Guest.findAll({
      limit: currentLimit,
      offset,
      where: {
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
      },
      order: [
        ['updatedAt', 'DESC']
      ]
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
      message: 'Guests retrieved successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function getGuest (req, res) {
  try {
    const { guestId } = req.params
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

function addGuest (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const {
        key,
        photo = null,
        name,
        gender,
        address = null,
        email = null,
        phone = null
      } = req.body

      const guest = await Guest.create({
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

function updateGuest (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { guestId } = req.params
      const {
        key,
        photo,
        name,
        gender,
        address,
        email,
        phone
      } = req.body

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

function deleteGuest (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { guestId } = req.params

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

function generateGuestQRCodeKey (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { guestId } = req.params
      const { size = 500 } = req.query

      const guest = await Guest.findByPk(guestId)

      if (!guest) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Guest not found'
        })
      }

      const qrCode = await QRCode.toBuffer(guest.key, {
        errorCorrectionLevel: 'H',
        width: size,
        margin: 2
      })

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': qrCode.length
      })
      res.end(qrCode)
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
  getGuest,
  getGuestPagination,
  addGuest,
  updateGuest,
  deleteGuest,
  generateGuestQRCodeKey,
  getGuestImageFile,
  uploadGuestProfileImage
}
