import moment from 'moment-timezone'
import { ERR_MSG, HTTP_STATUS } from '../constants'
import { ResponseBody, ResponseHandler } from '../utils/responseHandler'

const responseHandler = new ResponseHandler()
const { BLOCK_START_DATE_TIME, BLOCK_END_DATE_TIME } = process.env

export const isJourneyDisabled = () => {
  const blockStartDateTime = moment.tz(new Date(BLOCK_START_DATE_TIME), '').unix()
  const todayDateTime = moment.tz(new Date(), 'Asia/Kolkata').utcOffset('+05:30').unix()
  const blockEndDateTime = moment.tz(new Date(BLOCK_END_DATE_TIME), '').unix()
  if (blockStartDateTime <= todayDateTime && blockEndDateTime >= todayDateTime) {
    return true
  }
  return false
}

export const disbaleJourney = async (request, response, next) => {
  if (!isJourneyDisabled()) return next()
  const blockEndDate = moment.tz(new Date(BLOCK_END_DATE_TIME), '').format()
  const tillDate = moment.tz(blockEndDate, 'Asia/Kolkata').utcOffset('+05:30').format()

  return responseHandler.handleError(
    new ResponseBody(HTTP_STATUS.SERVICE_UNAVAILABLE, ERR_MSG.UNDER_MAINTENANCE, { tillDate }),
    response
  )
}
