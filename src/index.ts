import { Client } from 'minio'
import { config as configureDotenv } from 'dotenv'
import { getMinIOConfiguration } from './environment-configuration'
import { ObjectAccessedNotification } from './ObjectAccessedNotification'
import { PostgresDatabase } from './PostgresDatabase'

// load and parse .env variables
configureDotenv()

const database = new PostgresDatabase()
database.connect();

const minioCfg = getMinIOConfiguration()
const client = new Client(minioCfg)

const events = [
  's3:ObjectAccessed:Get'
]

const ee = client.listenBucketNotification(minioCfg.bucketName, '', '', events)
ee.on('error', err => {
  console.log('err')
  console.log(err)
})

ee.on('notification', async event => {
  const notification = event as ObjectAccessedNotification
  console.log(notification.s3.object.key)
  await database.incrementDownloadCount(notification.s3.object.key)
})
