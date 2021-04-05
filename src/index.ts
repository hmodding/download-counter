import { Client } from 'minio'
import { config as configureDotenv } from 'dotenv'
import { getConfiguration, getMinIOConfiguration } from './environment-configuration'
import { ObjectAccessedNotification } from './ObjectAccessedNotification'
import { PostgresDatabase } from './PostgresDatabase'
import { configureDefaultLogger, createModuleLogger } from './logger'

// load and parse .env variables
configureDotenv()
const config = getConfiguration();

configureDefaultLogger()
const logger = createModuleLogger('index')

if (config.environment === 'development') {
  logger.warn('Running in development mode. Make sure to set NODE_ENV=production in production environments!')
}

const database = new PostgresDatabase()
database.connect()


const client = new Client(config.minIO)

const events = [
  's3:ObjectAccessed:Get'
]

const ee = client.listenBucketNotification(config.minIO.bucketName, '', '', events)
ee.on('error', err => {
  logger.error(err)
})

ee.on('notification', async event => {
  const notification = event as ObjectAccessedNotification
  logger.debug(notification.s3.object.key)
  await database.incrementDownloadCount(notification.s3.object.key)
})
