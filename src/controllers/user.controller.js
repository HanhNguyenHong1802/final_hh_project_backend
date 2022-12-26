import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import { HTTP_STATUS, ERR_MSG, RES_MSG } from '../constants'
import { UserModel } from '../models'
import { RedisModel } from '../config'
import { logError, logData, ResponseBody, ResponseHandler } from '../utils'
import { UserSchema } from '../validation'

const responseHandler = new ResponseHandler()

const getProfile = async (request, response) => {
  const { _claims: claims } = request
  const { userId } = claims
  const user = await UserModel.findOne({ userId }, { password: 0 })
  return responseHandler.handleBody(new ResponseBody(HTTP_STATUS.OK, RES_MSG.OK, user), response)
}

const createUser = async (request, response) => {
  const { body } = request
  await UserSchema.validateAsync(body)
  const user = await UserModel.create(body)
  delete user._doc.password
  return responseHandler.handleBody(
    new ResponseBody(HTTP_STATUS.CREATED, RES_MSG.OK, user),
    response
  )
}

const login = async (request, response) => {
  const { body } = request
  const { userId, password } = body

  const user = await UserModel.findOne(
    { userId },
    {
      userId: 1,
      firstName: 1,
      lastName: 1,
      password: 1,
      userName: 1
    }
  ).lean()

  if (!user) {
    return responseHandler.handleError(
      new ResponseBody(HTTP_STATUS.NOT_FOUND, ERR_MSG.INVALID_USER),
      response
    )
  }
  const pstatus = await bcrypt.compare(password, user.password)
  delete user.password

  if (!pstatus) {
    return responseHandler.handleError(
      new ResponseBody(HTTP_STATUS.UNAUTHORIZED, ERR_MSG.INVALID_USER),
      response
    )
  }

  user.userName = `${user.firstName} ${user.lastName || ''}`
  delete user.firstName
  delete user.lastName
  delete user._id
  const { token } = await generateToken(user)

  return responseHandler.handleBody({ user, token }, response)
}

const logout = async (request, response, next) => {
  const { _userId } = request
  await RedisModel.del(_userId)
  response.setHeader('Clear-Site-Data', '"cache", "cookies"')
  return responseHandler.handleBody(new ResponseBody(HTTP_STATUS.OK, RES_MSG.LOGOUT), response)
}

const checkToken = async (request, response, next) => {
  const token = getToken(request)
  const { user } = await validateToken(token)
  request._userId = user.userId
  request._jwtToken = token
  request._claims = user
  next()
}

const generateToken = async user => {
  const { userId } = user
  const tokenSecretKey = crypto.randomBytes(16).toString('hex')
  const existingLoginIn = await RedisModel.get(userId)
  const secondSession = Boolean(existingLoginIn)
  const jwt = jsonwebtoken.sign(user, `${tokenSecretKey}`)
  await RedisModel.set(userId, { tokenSecretKey }, { expiry: '' })
  await RedisModel.del('login_' + userId)
  logData({ groupName: 'login', message: 'Login pass', data: { userId } })

  return { token: jwt, user, secondSession }
}

const validateToken = async token => {
  try {
    const user = jsonwebtoken.decode(token)
    if (!user) {
      throw new ResponseBody(
        HTTP_STATUS.UNAUTHORIZED,
        ERR_MSG.SESSION_TERMINATED,
        {},
        ERR_MSG.TOKEN_ERROR
      )
    }
    const { userId } = user
    const userDetails = await RedisModel.get(userId)

    if (!userDetails) {
      throw new ResponseBody(HTTP_STATUS.UNAUTHORIZED, ERR_MSG.TOKEN_EXPIRED, { userId })
    }
    const { tokenSecretKey = '' } = userDetails

    if (!tokenSecretKey) {
      throw new ResponseBody(
        HTTP_STATUS.UNAUTHORIZED,
        ERR_MSG.SESSION_TERMINATED,
        { userId },
        ERR_MSG.TOKEN_ERROR
      )
    }
    const tokenVerify = jsonwebtoken.verify(token, `${tokenSecretKey}`)
    await RedisModel.set(userId, { tokenSecretKey }, { expiry: '' })

    if (!tokenVerify) {
      throw new ResponseBody(
        HTTP_STATUS.UNAUTHORIZED,
        ERR_MSG.SESSION_TERMINATED,
        { userId },
        ERR_MSG.TOKEN_ERROR
      )
    }
    return { user, tokenSecretKey }
  } catch (e) {
    logError({ err: e, groupName: 'ValidateToken' })
    throw new ResponseBody(
      HTTP_STATUS.UNAUTHORIZED,
      ERR_MSG.SESSION_TERMINATED,
      {},
      ERR_MSG.TOKEN_ERROR
    )
  }
}

const getToken = request => {
  const authorization = request.headers.authorization || ''
  return authorization.split(' ')[1]
}

export const usersController = {
  createUser,
  login,
  checkToken,
  logout,
  validateToken,
  getProfile
}
