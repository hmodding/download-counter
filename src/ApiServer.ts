import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { Handlers } from '@sentry/node'
import { Server } from 'http'
import { createModuleLogger } from './logger'
import { getApiServerConfiguration } from './environment-configuration'
import { Database } from './Database'

const logger = createModuleLogger('ApiServer')

/**
 * A simple API server that offers download counts.
 */
export class ApiServer {
  private readonly server: Server
  private readonly database: Database

  public constructor (database: Database) {
    this.database = database

    const app = express()

    // various middleware
    app.use(Handlers.requestHandler())
    app.use(morgan('tiny', {
      stream: {
        write: (string: string) => logger.http(string)
      }
    }))

    // endpoints
    app.get('/downloads/file', (req: Request, res: Response, next: NextFunction) => this.getDownloadsFile(req, res, next))
    app.get('/downloads/directory', (req: Request, res: Response, next: NextFunction) => this.getDownloadsDirectory(req, res, next))
    app.use((req: Request, res: Response) => this.notFound(req, res))

    // error handlers
    app.use(Handlers.errorHandler())
    app.use((err: any, req: Request, res: Response, next: NextFunction) => this.error(err, req, res, next))

    const port = getApiServerConfiguration().port
    this.server = app.listen(port, () => {
      logger.info(`Listening on port ${port}.`)
    })
  }

  /**
   * Handles GET requests to the `/downloads/file` endpoint.
   * @param req the http request.
   * @param res the http response.
   * @param next the function to call to forward this request to the next
   * handler.
   */
  private async getDownloadsFile (req: Request, res: Response, next: NextFunction): Promise<void> {
    const path = req.query.path

    if (typeof path !== 'string') {
      res.status(400).json({
        error: 'BadRequest',
        message: 'Your request is missing the `path` parameter.'
      })

    } else {
      const downloads = await this.database.getDownloadCount(path)

      res.status(200).json({
        path,
        downloads
      })
    }
  }

  /**
   * Handles GET requests to the `/downloads/directory` endpoint.
   * @param req the http request.
   * @param res the http response.
   * @param next the function to call to forward this request to the next
   * handler.
   */
  private async getDownloadsDirectory (req: Request, res: Response, next: NextFunction): Promise<void> {
    const path = req.query.path

    if (typeof path !== 'string') {
      res.status(400).json({
        error: 'BadRequest',
        message: 'Your request is missing the `path` parameter.'
      })

    } else {
      const downloads = await this.database.getDownloadCountForDirectory(path)

      res.status(200).json({
        path,
        downloads
      })
    }
  }

  /**
   * Express default handler for routes that do not exist.
   * @param req the http request.
   * @param res the http response.
   */
  private notFound (req: Request, res: Response) {
    res.status(404).json({
      error: 'NotFound',
      message: 'The requested resource could not be found!'
    })
  }

  /**
   * Express error handler.
   * @param err the error
   * @param req the http request.
   * @param res the http response.
   * @param next the function to call to forward this request to the next
   * handler.
   */
  private error (err: any, req: Request, res: Response, next: NextFunction): void {
    logger.error(err)
    res.status(500).json({
      error: 'ServerError',
      message: 'Something went wrong on our end!'
    })
  }

  /**
   * Stops the http server.
   */
  public shutdown (): void {
    this.server.close()
    logger.info('Shutdown!')
  }
}
