import { AppError } from '../utils'
import { ERR_MSG, HTTP_STATUS } from '../constants'

export const scriptTagRemover = (request, response, next) => {
  if (request.method === 'GET') {
    return next()
  }

  Object.values(request.body).forEach(item => {
    if (/javascript:|<|>/g.test(item)) {
      throw new AppError(ERR_MSG.NO_SPECIAL_CHARACTER, HTTP_STATUS.NOT_FOUND)
    }
  })

  next()
}
