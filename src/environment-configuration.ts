import { Configuration, MinIOConfiguration } from './Configuration'

/**
 * Reads the configuration from environment variables.
 * @throws an error if any configuration value is invalid.
 */
export function getConfiguration (): Configuration {
  return {
    environment: getEnvironment(),
    minIO: getMinIOConfiguration(),
    postgresConnectionString: getPostgresConfiguration()
  }
}

/**
 * Reads the environment type from the NODE_ENV environment variable. Only
 * `production` is considered as a production environment, every other value
 * (including undefined, null, etc.) indicates a development environment.
 */
function getEnvironment (): 'development' | 'production' {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

/**
 * Reads the MinIOConfiguration from env variables.
 * @returns the MinIOConfiguration.
 * @throws an error if any configuration value is invalid.
 */
export function getMinIOConfiguration (): MinIOConfiguration {
  return {
    accessKey: getMIOAccessKey(),
    secretKey: getMIOSecretKey(),
    endPoint: getMIOEndpoint(),
    useSSL: getMIOUseSSL(),
    bucketName: getMIOBucketName(),
    port: getMIOPort()
  }
}

function getMIOAccessKey (): string {
  const accessKey = process.env.MINIO_ACCESS_KEY
  if (accessKey === undefined) {
    throw new Error('MinIO access key (MINIO_ACCESS_KEY env variable) is not configured!')
  }
  return accessKey
}

function getMIOSecretKey (): string {
  const secretKey = process.env.MINIO_SECRET_KEY
  if (secretKey === undefined) {
    throw new Error('MinIO secret key (MINIO_SECRET_KEY env variable) is not configured!')
  }
  return secretKey
}

function getMIOEndpoint (): string {
  const endPoint = process.env.MINIO_ENDPOINT
  if (endPoint === undefined) {
    throw new Error('MinIO endpoint (MINIO_ENDPOINT env variable) is not configured!')
  }
  return endPoint
}

function getMIOUseSSL (): boolean {
  // default is true
  return process.env.MINIO_USE_SSL !== 'false'
}

function getMIOBucketName (): string {
  const bucketName = process.env.MINIO_BUCKET_NAME
  if (bucketName === undefined) {
    throw new Error('MinIO bucket name (MINIO_BUCKET_NAME env variable) is not configured!')
  }
  return bucketName
}

function getMIOPort (): number {
  const portString = process.env.MINIO_PORT
  if (portString === undefined) {
    throw new Error('MinIO port (MINIO_PORT env variable) is not configured!')
  }

  const port = parseInt(portString, 10)
  if (isNaN(port)) {
    throw new Error('MinIO port (MINIO_PORT env variable) is not a valid number!')
  }
  return port
}

function getPostgresConfiguration (): string {
  const pgString = process.env.POSTGRES_CONNECTION_STRING
  if (pgString === undefined) {
    throw new Error('Postgres connection string (POSTGRES_CONNECTION_STRING env variable) is not configured!')
  }
  return pgString
}
