const Guest = require('../../models').guest
const Attendance = require('../../models').attendance
const validationResponseMaker = require('../../utils/validation-response-maker')
const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')
const writeXlsxFile = require('write-excel-file')
const { Op } = require('sequelize')

async function getGuestPresencePagination (req, res) {
  try {
    const { page, limit, search = '' } = req.query
    const currentPage = page ? parseInt(page) : 1
    const currentLimit = limit ? parseInt(limit) : 10
    const offset = (currentPage - 1) * currentLimit

    const totalAttendances = await Attendance.count()

    const attendances = await Attendance.findAll({
      limit: currentLimit,
      offset,
      include: [
        {
          model: Guest,
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
        }
      ],
      order: [['time', 'DESC']]
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
      const { guestKey } = req.body

      const guest = await Guest.findOne({
        where: {
          key: guestKey
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
          guestId: guest.id
        }
      })

      if (attendanceExists) {
        return responseMaker(res, null, {
          ...responses.conflict,
          message: 'Guest presence already recorded'
        })
      }

      const attendance = await Attendance.create({
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

async function clearAttendances (req, res) {
  try {
    await Attendance.destroy({
      where: {}
    })

    return responseMaker(res, null, {
      ...responses.success,
      message: 'Attendances cleared successfully'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function generateExcelAttendances (req, res) {
  try {
    const guests = await Guest.findAll({
      include: [
        {
          model: Attendance,
          required: false
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
    res.set('Content-Disposition', 'attachment; filename="Presence.xlsx"')
    res.send(buffer)
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  getGuestPresencePagination,
  guestPresence,
  clearAttendances,
  generateExcelAttendances
}
