import debug from 'debug'

const logger = debug('app:logger')

export const logAxiosError = ({ err, groupName = 'AxiosError' }) => {
  logger(JSON.stringify({ groupName, err: JSON.stringify(err) }))
}

export const logError = ({ err = 'logError', groupName = 'logError', message = null }) => {
  let params = {
    groupName,
    errorMessage: err.toString(),
    stack: err.stack || err,
    code: err.code || '',
    userMessage: message || ''
  }
  if (err.constructor && err.constructor.name === 'ResponseBody') {
    params = { groupName, ...err }
  }
  logger(JSON.stringify(params))
}

export const logData = ({ data = {}, groupName = 'logData', message = null }) => {
  const params = { groupName, data, message }
  logger(JSON.stringify(params))
}
