import { Database } from './Database'
import { Client } from 'pg'
import { getConfiguration } from './environment-configuration'

/**
 * Database implementation for postgres.
 */
export class PostgresDatabase implements Database {
  client: Client

  constructor () {
    this.client = new Client({
      connectionString: getConfiguration().postgresConnectionString
    })
  }

  async connect (): Promise<void> {
    await this.client.connect()
  }

  async disconnect (): Promise<void> {
    await this.client.end()
  }

  async getDownloadCount (file: string): Promise<number> {
    const res = await this.client.query('SELECT downloads FROM files WHERE key = $1', [file])
    if (res.rowCount === 0) {
      return 0
    } else {
      return res.rows[0].downloads
    }
  }

  async incrementDownloadCount (file: string): Promise<void> {
    await this.client.query('INSERT INTO files (key, downloads) VALUES ($1, 1) ON CONFLICT DO UPDATE SET downloads = downloads + 1', [file])
  }
}
