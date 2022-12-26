import express from 'express'
import { asyncMiddleware } from '../middlewares'
import { securityController } from '../controllers'

const securityRouter = express.Router()

securityRouter.post('/encryptRequest', asyncMiddleware(securityController.encryptRequest))
securityRouter.post('/decryptRequest', asyncMiddleware(securityController.decryptRequest))
securityRouter.post('/encryptResponse', asyncMiddleware(securityController.encryptResponse))
securityRouter.post('/decryptResponse', asyncMiddleware(securityController.decryptResponse))

export { securityRouter }
