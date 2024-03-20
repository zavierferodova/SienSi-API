const Room = require('../../models').room
const responses = require('../../constants/responses')
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')

async function getRoomPagination (req, res) {
  try {
    const { page, limit } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit

    const totalRooms = await Room.count()
    const rooms = await Room.findAll({
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

module.exports = {
  getRoomPagination,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom
}
