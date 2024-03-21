const multer = require('multer')
const config = require('../config')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const responses = require('../constants/responses')
const responseMaker = require('../utils/response-maker')

const storagePath = path.join(config.storagePath, 'guests')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true })
    }
    cb(null, storagePath)
  },
  filename: function (req, file, cb) {
    const prefix = 'guest-profile-image-'
    const slug = uuidv4()
    const extension = path.extname(file.originalname)
    const filename = `${prefix}${slug}${extension}`
    cb(null, filename)
  }
})

const uploadGuestProfileImage = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG are allowed'))
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2 // Max filesize 2 MB
  }
})

const uploadGuestProfileImageMiddleware = (req, res, next) => {
  try {
    uploadGuestProfileImage.single('image')(req, res, (err) => {
      if (err) {
        return responseMaker(res, null, {
          ...responses.badRequest,
          message: err.message
        })
      }

      next()
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  guestImageStoragePath: storagePath,
  uploadGuestProfileImageMiddleware
}
