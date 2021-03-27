import { Client,  } from 'minio'
import { config } from 'dotenv'

interface Notification {
    s3: {
        object: {
            key: string;
        }
    }
}

// load and parse .env variables
config()

const accessKey = process.env.MINIO_ACCESS_KEY
if (accessKey === undefined) {
  throw new Error()
}

const secretKey = process.env.MINIO_SECRET_KEY
if (secretKey === undefined) {
  throw new Error()
}

const endPoint = process.env.MINIO_ENDPOINT
if (endPoint === undefined) {
  throw new Error()
}

const bucketName = process.env.MINIO_BUCKET
if (bucketName === undefined) {
  throw new Error()
}

const client = new Client({
  accessKey,
  secretKey,
  endPoint,
  port: 443,
  useSSL: true
})

const events = [
  's3:ObjectAccessed:Get'
]

const ee = client.listenBucketNotification(bucketName, '', '', events)
ee.on('notification', event => {
  const notification = event as Notification;
  console.log(notification.s3.object.key)
})
