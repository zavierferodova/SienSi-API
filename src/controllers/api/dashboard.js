const responseMaker = require('../../utils/response-maker')
const responses = require('../../constants/responses')
const Room = require('../../models').room
const Guest = require('../../models').guest
const Session = require('../../models').session
const Attendance = require('../../models').attendance
const sequelize = require('../../models').sequelize

const mainInsights = async (req, res) => {
  try {
    const totalRooms = await Room.count()
    const totalGuests = await Guest.count()

    const rooms = await Room.findAll({
      attributes: {
        include: [
          'room.id',
          [sequelize.fn('COUNT', sequelize.col('sessions.id')), 'totalSessions'],
          [sequelize.fn('COUNT', sequelize.col('guests.id')), 'totalGuests'],
          [sequelize.literal('COUNT(sessions.id) * COUNT(guests.id)'), 'totalRoomAttendances']
        ]
      },
      include: [
        {
          model: Session
        },
        {
          model: Guest
        }
      ],
      group: ['room.id']
    })

    const roomAttendances = rooms.map(room => room.dataValues.totalRoomAttendances)
    const totalAttendances = roomAttendances.reduce((acc, curr) => acc + curr, 0)
    const realAttendances = await Attendance.count()
    const percentageAttendances = (realAttendances / totalAttendances) * 100

    const data = {
      totalRooms,
      totalGuests,
      percentageAttendances
    }

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Success retrieve main insights'
    })
  } catch (e) {
    return responseMaker(res, null, {
      ...responses.error,
      message: e.message
    })
  }
}

const topRoomWithGuests = async (req, res) => {
  try {
    const sqlQuery = `
        SELECT 'room'.'id', 'room'.'name', COUNT('guests'.'id') AS 'totalGuests', 'guests'.'id'
        FROM 'rooms' AS 'room' 
        LEFT OUTER JOIN 'guests' AS 'guests' 
        ON 'room'.'id' = 'guests'.'roomId' 
        GROUP BY 'room'.'id' 
        ORDER BY totalGuests DESC 
        LIMIT 10;`

    const rooms = await sequelize.query(sqlQuery, {
      model: Room,
      mapToModel: true
    })

    const data = rooms.map(room => ({
      id: room.dataValues.id,
      name: room.dataValues.name,
      totalGuests: room.dataValues.totalGuests
    }))

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Success retrieve top room with guest ammounts'
    })
  } catch (e) {
    return responseMaker(res, null, {
      ...responses.error,
      message: e.message
    })
  }
}

const topRoomWithAttendances = async (req, res) => {
  try {
    const sqlQuery = `
        SELECT rooms.id, rooms.name, 
        COUNT(guests.id) * COUNT(sessions.id) AS totalAttendances, 
        COUNT(attendances.id) OVER() AS realAttendances,
        (COUNT(attendances.id) OVER() * 100 / (COUNT(guests.id) * COUNT(sessions.id))) AS percentageAttendance
        FROM rooms
        LEFT JOIN sessions ON rooms.id = sessions.roomId
        LEFT JOIN guests ON guests.roomId = rooms.id
        LEFT JOIN attendances ON sessions.id = attendances.sessionId
        GROUP BY rooms.id
        LIMIT 5;
    `

    const rooms = await sequelize.query(sqlQuery, {
      model: Room,
      mapToModel: true
    })

    const data = rooms.map(room => ({
      id: room.dataValues.id,
      name: room.dataValues.name,
      percentageAttendance: room.dataValues.percentageAttendance ? room.dataValues.percentageAttendance : 0
    }))

    return responseMaker(res, data, {
      ...responses.success,
      message: 'Success retrieve top room with attendances'
    })
  } catch (e) {
    return responseMaker(res, null, {
      ...responses.error,
      message: e.message
    })
  }
}

module.exports = {
  mainInsights,
  topRoomWithGuests,
  topRoomWithAttendances
}
