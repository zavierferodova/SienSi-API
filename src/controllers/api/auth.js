const User = require('../../models').user
const responseMaker = require('../../utils/response-maker')
const validationResponseMaker = require('../../utils/validation-response-maker')
const responses = require('../../constants/responses')
const bycrypt = require('bcryptjs')
const { verifyToken } = require('../../utils/token-manager')
const config = require('../../config')

function register (req, res) {
  try {
    validationResponseMaker(req, res, async () => {
      const { name, email, password } = req.body

      const newUser = await User.create({
        name,
        email,
        password: bycrypt.hashSync(password, 8)
      })

      const user = await User.findByPk(newUser.id, {
        attributes: {
          exclude: ['password']
        }
      })

      const data = {
        user
      }

      return responseMaker(res, data, {
        ...responses.created,
        message: 'User created'
      }, {
        includeJwt: true,
        includeRefreshToken: true,
        accessTokenData: {
          id: user.id
        }
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

function login (req, res) {
  try {
    return validationResponseMaker(req, res, async () => {
      const { email, password } = req.body

      const data = await User.findOne({
        where: {
          email
        }
      })

      if (!data) {
        throw new Error('User not found')
      }

      const passwordIsValid = bycrypt.compareSync(password, data.password)

      if (!passwordIsValid) {
        throw new Error('Invalid password')
      }

      delete data.dataValues.password
      const user = {
        user: data
      }

      return responseMaker(res, user, {
        ...responses.success,
        message: 'User logged in'
      }, {
        includeJwt: true,
        includeRefreshToken: true,
        accessTokenData: {
          id: data.id
        },
        refreshTokenData: {
          id: data.id
        }
      })
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

async function updateAccessToken (req, res) {
  try {
    const tokenHeader = req.headers['x-refresh-token']
    if (!tokenHeader) {
      return responseMaker(res, null, {
        ...responses.unauthorized,
        message: 'Token not provided'
      })
    }

    const [format, token] = tokenHeader.split(' ')

    if (format !== 'Bearer') {
      return responseMaker(res, null, {
        ...responses.unauthorized,
        message: 'Invalid token format'
      })
    }

    if (!token) {
      return responseMaker(res, null, {
        ...responses.unauthorized,
        message: 'Token not provided'
      })
    }

    const data = verifyToken(token)
    if (data.signature) {
      const isSignatureValid = bycrypt.compareSync(config.keySignature, data.signature)
      if (isSignatureValid) {
        return responseMaker(res, null, {
          ...responses.success,
          message: 'Access token updated'
        }, {
          includeJwt: true,
          accessTokenData: {
            id: data.id
          }
        })
      }
    }

    return responseMaker(res, null, {
      ...responses.unauthorized,
      message: 'Failed to authenticate token'
    })
  } catch (error) {
    return responseMaker(res, null, {
      ...responses.error,
      message: error.message
    })
  }
}

module.exports = {
  register,
  login,
  updateAccessToken
}
