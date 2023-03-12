const debug = require('debug')
const log = debug('app:index')
require('dotenv').config();
require('module-alias/register')
const applicationEnvVars = [
  'NODE_ENV',
  'PORT'
]

const corsEnvVars = [
  'CORS_ORIGIN',
  'CORS_METHODS'
]

const dbConnectEnvVars = [
  'MONGO_DB_CONNECTION',
  'PG_CONNECTION',
  'REDIS_CONNECTION'
]

const rateLimitEnvVars = [
  'RATE_LIMIT_TIME',
  'RATE_LIMIT_MAX_REQUESTS'
]

const encryptionEnvVars = [
  'SALT_ROUNDS',
  'ALGORITHM',
  'ENABLE_ENCRYPTION',
  'ENCRYPTION_PUBLIC_KEY',
  'ENCRYPTION_PRIVATE_KEY'
]

const envVars = [
  ...applicationEnvVars,
  ...corsEnvVars,
  ...dbConnectEnvVars,
  ...rateLimitEnvVars,
  ...encryptionEnvVars
]

/*
 * Code to check if required enviroment variables are set to run the application
 */
const unusedEnvVars = envVars.filter(i => !process.env[i])

if (unusedEnvVars.length) throw new Error('Required ENV variables are not set: [' + unusedEnvVars.join(', ') + ']')

const { app } = process.env.NODE_ENV === 'local' ? require('./src') : require('./build/src')

app.listen(process.env.PORT, () => log(`App started on port ${process.env.PORT}`))

module.exports = app
