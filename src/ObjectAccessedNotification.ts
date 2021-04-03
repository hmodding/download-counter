/**
 * Type definition for MinIO s3:ObjectAccessed:Get notifications that contains
 * types relevant to us.
 */
export interface ObjectAccessedNotification {
  s3: {
    object: {
      key: string
    }
  }
}
