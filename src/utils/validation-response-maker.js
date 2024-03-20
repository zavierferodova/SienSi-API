const { validationResult } = require('express-validator')
const responseMaker = require('./response-maker')
const responses = require('../constants/responses')

function validationResponseMaker (req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const errors = result.array()
    return responseMaker(res, null, {
      ...responses.badRequest,
      message: errors[0].msg
    })
  }

  next()
}

module.exports = validationResponseMaker
