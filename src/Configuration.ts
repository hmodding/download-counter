/**
 * A collection for configurable variables for this application.
 */
export interface Configuration {
  /**
   * The type of environment this application is running in.
   */
  environment: 'development' | 'production'
  /**
   * MinIO-related variables.
   */
  minIO: MinIOConfiguration
  /**
   * Connection string for the postgres database.
   */
  postgresConnectionString: string
}

/**
 * A collection of configurable variables for the MinIO connection.
 */
export interface MinIOConfiguration {
  /**
   * The accessKey / username to use for connecting to the MinIO server.
   */
  accessKey: string
  /**
   * The secretKey / password to use for connecting to the MinIO server.
   */
  secretKey: string
  /**
   * The MinIO server enpoint.
   */
  endPoint: string
  /**
   * Whether to use HTTPS instead of HTTP.
   */
  useSSL: boolean
  /**
   * The name of the MinIO bucket to watch.
   */
  bucketName: string
  /**
   * The of the MinIO endpoint.
   */
  port: number
}
