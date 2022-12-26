import { Client } from 'pg'
import debug from 'debug'

const log = debug('app:pg')

export const pgClient = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  user: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE_NAME
})

export const pgConnect = () => {
  pgClient
    .connect()
    .then(() => log('Connected to PG'))
    .catch(err => {
      log('PG connection Error', err)
    })
}
