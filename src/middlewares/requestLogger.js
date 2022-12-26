import audit from 'express-requests-logger'

export const requestLogs = audit({
  excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
  request: {
    maskBody: ['password'], // Mask 'password' field in incoming requests
    excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
    excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
    maskHeaders: ['header1'] // Mask 'header1' header in incoming requests
  },
  response: {
    maskBody: ['session_token', 'token'], // Mask 'session_token' field in response body
    excludeHeaders: ['*'], // Exclude all headers from responses,
    // excludeBody: ['*'], // Exclude all body from responses
    maskHeaders: ['header1'] // Mask 'header1' header in incoming requests
  }
})
