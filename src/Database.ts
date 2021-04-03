/**
 * Provides access to the database.
 */
export interface Database {
  /**
   * Connects to the database.
   * @throws an error if the connection cannot be established.
   */
  connect: () => Promise<void>

  /**
   * Disconnects from the database.
   * @throws any errors that were thrown during disconnection.
   */
  disconnect: () => Promise<void>

  /**
   * Gets the amount of downloads for a given file.
   * @param file the file key inside of the bucket.
   * @returns the amount of downloads for the given file or 0 if the file was
   *   not found.
   */
  getDownloadCount: (file: string) => Promise<number>

  /**
   * Increments the download count of a given file by 1.
   * @param file the file key inside of the bucket.
   */
  incrementDownloadCount: (file: string) => Promise<void>
}
