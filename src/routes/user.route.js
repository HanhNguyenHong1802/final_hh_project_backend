import express from 'express'
import { asyncMiddleware } from '../middlewares'
import { usersController } from '../controllers/user.controller'
import { userDocs } from '../api-docs'

const userRouter = express.Router()

userDocs()

userRouter.get(
  '/profile',
  asyncMiddleware(usersController.checkToken),
  asyncMiddleware(usersController.getProfile)
)
/**
 *
 * @api {get} users/profile Get User Information
 * @apiName Profile
 * @apiGroup User
 * @apiDescription API to Get User Information
 *
 * @apiUse userProfileRequestResponse
 *
 */

userRouter.post('/login', asyncMiddleware(usersController.login))
/**
 *
 * @api {post} users/login Login
 * @apiName Login
 * @apiGroup User
 * @apiDescription API to Login for different user
 *
 * @apiUse loginRequestResponse
 *
 */

userRouter.get(
  '/logout',
  asyncMiddleware(usersController.checkToken),
  asyncMiddleware(usersController.logout)
)
/**
 *
 * @api {post} users/logout Logout
 * @apiName Logout
 * @apiGroup User
 * @apiDescription API to Logout the User
 *
 * @apiUse logoutRequestResponse
 *
 */

userRouter.post(
  '/sign-up',
  asyncMiddleware(usersController.checkToken),
  asyncMiddleware(usersController.createUser)
)
/**
 *
 * @api {post} users/sign-up Creating New User
 * @apiName Signup
 * @apiGroup User
 * @apiDescription API to Create New User
 *
 * @apiUse signUpRequestResponse
 *
 */

export { userRouter }
