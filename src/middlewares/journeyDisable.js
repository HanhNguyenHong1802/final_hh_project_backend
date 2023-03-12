const moment = require('moment-timezone');
const { ERR_MSG, HTTP_STATUS } = require('@/constants/errorMsg');
const { ResponseBody, ResponseHandler } = require('@/utils/responseHandler');

const responseHandler = new ResponseHandler();
const { BLOCK_START_DATE_TIME, BLOCK_END_DATE_TIME } = process.env;

const isJourneyDisabled = () => {
  const blockStartDateTime = moment
    .tz(new Date(BLOCK_START_DATE_TIME), '')
    .unix();
  const todayDateTime = moment
    .tz(new Date(), 'Asia/Kolkata')
    .utcOffset('+05:30')
    .unix();
  const blockEndDateTime = moment.tz(new Date(BLOCK_END_DATE_TIME), '').unix();
  return !!(
    blockStartDateTime <= todayDateTime && blockEndDateTime >= todayDateTime
  );
};

const disbaleJourney = async (request, response, next) => {
  if (!isJourneyDisabled()) return next();
  const blockEndDate = moment.tz(new Date(BLOCK_END_DATE_TIME), '').format();
  const tillDate = moment
    .tz(blockEndDate, 'Asia/Kolkata')
    .utcOffset('+05:30')
    .format();

  return responseHandler.handleError(
    new ResponseBody(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERR_MSG.UNDER_MAINTENANCE,
      { tillDate },
    ),
    response,
  );
};
module.exports = {
  isJourneyDisabled,
  disbaleJourney,
};
