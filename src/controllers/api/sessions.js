const Session = require('../../models').session
const Room = require('../../models').room
const Guest = require('../../models').guest
const Attendance = require('../../models').attendance
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')
const { Op } = require('sequelize')
const writeXlsxFile = require('write-excel-file')

async function getRoomSessionPagination (req, res) {
  try {
    const { roomId } = req.params
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit
    const room = await Room.findByPk(roomId)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const totalSessions = await Session.count({
      where: {
        [Op.and]: [
          {
            roomId
          },
          {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        ]
      }
    })

    const sessions = await Session.findAll({
      limit: currentLimit,
      offset,
      where: {
        [Op.and]: [
          {
            roomId
          },
          {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        ]
      }
    })

    const totalPages = Math.ceil(parseInt(totalSessions) / parseInt(currentLimit))

    const data = {
      sessions,
      total: totalSessions,
      limit: currentLimit,
      page: currentPage,
      totalPages
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Sessions retrieved successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function getRoomSession (req, res) {
  try {
    const { roomId, sessionId } = req.params
    const room = await Room.findByPk(roomId)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const session = await Session.findByPk(sessionId)

    if (!session) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Session not found'
      })
    }

    const data = {
      session
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Session found'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function addRoomSession (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId } = req.params
      const { name, allowPresence } = req.body
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const session = await Session.create({
        roomId,
        name,
        allowPresence
      })

      const data = {
        session
      }

      return responseMaker(res, data, {
        ...responses.created,
        message: 'Session created successfully'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function updateRoomSession (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId, sessionId } = req.params
      const { name, allowPresence } = req.body
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const session = await Session.findByPk(sessionId)

      if (!session) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Session not found'
        })
      }

      await session.update({
        roomId,
        name,
        allowPresence
      })

      const data = {
        session
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Session updated successfully'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function deleteRoomSession (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId, sessionId } = req.params
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const session = await Session.findByPk(sessionId)

      if (!session) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Session not found'
        })
      }

      await session.destroy()

      const data = {
        session
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Session deleted successfully'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function getGuestPresencePagination (req, res) {
  try {
    const { roomId, sessionId } = req.params
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit
    const room = await Room.findByPk(roomId)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const session = await Session.findByPk(sessionId)

    if (!session) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Session not found'
      })
    }

    const totalAttendances = await Attendance.count({
      where: {
        sessionId
      },
      include: [
        {
          required: true,
          model: Guest,
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        }
      ]
    })

    const attendances = await Attendance.findAll({
      where: {
        sessionId
      },
      limit: currentLimit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ],
      include: [
        {
          required: true,
          model: Guest,
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        }
      ]
    })

    const totalPages = Math.ceil(parseInt(totalAttendances) / parseInt(currentLimit))

    const data = {
      attendances,
      total: totalAttendances,
      limit: currentLimit,
      page: currentPage,
      pages: totalPages
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Attendances retrieved successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function guestPresence (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { roomId, sessionId } = req.params
      const { guestKey } = req.body
      const room = await Room.findByPk(roomId)

      if (!room) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Room not found'
        })
      }

      const session = await Session.findByPk(sessionId)

      if (!session) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Session not found'
        })
      }

      if (!session.allowPresence) {
        return responseMaker(res, null, {
          ...responses.badRequest,
          message: 'Presence recording is not allowed for this session'
        })
      }

      const guest = await Guest.findOne({
        where: {
          [Op.and]: {
            roomId,
            key: guestKey
          }
        }
      })

      if (!guest) {
        return responseMaker(res, null, {
          ...responses.notFound,
          message: 'Guest not found'
        })
      }

      const attendanceExists = await Attendance.findOne({
        where: {
          [Op.and]: {
            sessionId,
            guestId: guest.id
          }
        }
      })

      if (attendanceExists) {
        return responseMaker(res, null, {
          ...responses.conflict,
          message: 'Guest presence already recorded'
        })
      }

      const attendance = await Attendance.create({
        roomId,
        sessionId,
        guestId: guest.id
      })

      const data = {
        attendance
      }

      return responseMaker(res, data, {
        ...responses.success,
        message: 'Guest presence recorded successfully'
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function generateExcelSessionAttendances (req, res) {
  try {
    const { roomId, sessionId } = req.params

    const room = await Room.findByPk(roomId)

    if (!room) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Room not found'
      })
    }

    const session = await Session.findByPk(sessionId)

    if (!session) {
      return responseMaker(res, null, {
        ...responses.notFound,
        message: 'Session not found'
      })
    }

    const guests = await Guest.findAll({
      where: {
        roomId
      },
      include: [
        {
          model: Room
        },
        {
          model: Attendance,
          required: false,
          where: {
            sessionId
          }
        }
      ]
    })

    const objects = guests.map((guest, index) => {
      return {
        number: `${Number(index) + 1}`,
        key: guest.key,
        name: guest.name,
        gender: guest.gender,
        address: guest.address || '-',
        email: guest.email || '-',
        phone: guest.phone || '-',
        timePresence: guest.attendances.length > 0 ? guest.attendances[0].createdAt : ''
      }
    })

    const schema = [
      {
        column: 'No',
        type: String,
        value: guest => guest.number,
        width: 3
      },
      {
        column: 'Key',
        type: String,
        value: guest => guest.key,
        width: 10
      },
      {
        column: 'Name',
        type: String,
        value: guest => guest.name,
        width: 15
      },
      {
        column: 'Gender',
        type: String,
        value: guest => guest.gender,
        width: 10
      },
      {
        column: 'Address',
        type: String,
        value: guest => guest.address,
        width: 15
      },
      {
        column: 'Email',
        type: String,
        value: guest => guest.email,
        width: 15
      },
      {
        column: 'Phone',
        type: String,
        value: guest => guest.phone,
        width: 15
      },
      {
        column: 'Time Presence',
        type: Date,
        format: 'dd/mm/yyyy hh:mm:ss AM/PM',
        value: guest => guest.timePresence,
        width: 25
      }
    ]

    const blob = await writeXlsxFile(objects, {
      schema,
      buffer: true
    })

    const buffer = Buffer.from(await blob.arrayBuffer())
    res.set('Content-Type', blob.type)
    res.set('Content-Length', blob.size)
    res.set('Content-Disposition', `attachment; filename="${session.name} - ${room.name}.xlsx"`)
    res.send(buffer)
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  getRoomSession,
  getRoomSessionPagination,
  addRoomSession,
  updateRoomSession,
  deleteRoomSession,
  getGuestPresencePagination,
  guestPresence,
  generateExcelSessionAttendances
}
