import Redis from 'ioredis'
import debug from 'debug'

const log = debug('app:redis')

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PREFIX,
  REDIS_EXPIRY
} = process.env

let redis

export const redisConnect = async () => {
  if (REDIS_HOST && REDIS_PORT) {
    redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT
    })

    redis.on('connect', error => {
      log('Redis Connection Established')
      if (error) {
        log(`Unable to connect to redis server:, ${error}`)
      }
    })
  }
}

export const RedisModel = {
  get,
  set,
  del
}
async function get (key) {
  if (redis.status === 'ready') {
    const _key = `${REDIS_PREFIX}_${key}`
    const value = await redis.get(_key)
    try {
      return JSON.parse(value)
    } catch (error) { return value }
  }
}
async function set (key, value, option = {}) {
  if (redis.status === 'ready') {
    const _key = `${REDIS_PREFIX}_${key}`
    const redisExpiry = option.expiry || REDIS_EXPIRY
    if (option.expiry === null) {
      await redis.set(_key, JSON.stringify(value))
    } else {
      await redis.set(_key, JSON.stringify(value), 'EX', redisExpiry)
    }
  }
}
async function del (key) {
  if (redis.status === 'ready') {
    const _key = `${REDIS_PREFIX}_${key}`
    await redis.del(_key)
  }
}
