const Guest = require('../../models').guest
const Room = require('../../models').room
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')

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

async function getRoomGuestPagination (req, res) {
  try {
    const { page, limit } = req.query
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

    const totalGuests = await Guest.count()
    const guests = await Guest.findAll({
      limit: currentLimit,
      offset,
      where: {
        roomId
      }
      // include: [
      //   {
      //     model: Room
      //   }
      // ]
    })
    const totalPages = Math.ceil(parseInt(totalGuests) / parseInt(currentLimit))

    const data = {
      guests,
      total: totalGuests,
      limit: currentLimit,
      page: currentPage,
      pages: totalPages
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
      const { guestId } = req.params
      const guest = await Guest.findByPk(guestId)
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

module.exports = {
  getRoomGuest,
  getRoomGuestPagination,
  addRoomGuest,
  updateRoomGuest,
  deleteRoomGuest
}
