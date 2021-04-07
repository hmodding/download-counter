# download-counter
This application is a proof-of-concept for measuring download counts for
individual files and whole folders that are served from a
[MinIO](https://min.io) object storage bucket.

## Table of Contents
* [File structure](#File-structure)
* [Configuration](#Configuration)
* [Development notes](#Development-notes)
* [Deployment](#Deployment)
* [License](#License)

## Development Setup
You'll need to have Node.js v15 or higher as well as `npm`.

1. Install dependencies: `npm install`
2. [Configure](#Configuration) the application.
3. Run in development mode `npm run dev`

## File structure
* [`dist/`](./dist) contains the JavaScript files. Use `npm run build` to build.
* [`node_modules/`](./node_modules) contains dependency packages.
* [`scripts/`](./scripts) contains various scripts that are useful for deploying
  the app and managing the database.
* [`src/`](./src) contains the TypeScript source code for this app.

## API
The measured download counts are available via a REST API.

### Endpoints
The following endpoints are available on an http server on the host of this application with the port specified in the [configuration](#Configuration). The base url is `http://host:port` and all endpoints use the `GET` http verb.

| Endpoint | Description |
| --- | --- |
| `/downloads/file?path=path%2fwithin%2fbucket.ext` | Returns the download count for a given file (or 0 if it does not exist). |
| `/downloads/directory?path=folderpath%2fwithin%2fbucket%2f` | Returns the total download count for all files within a given folder (or 0 if no such files exist). |

A successful response to both request types will be in the following schema:
```json
{
    "path": "decoded/path/within/bucket.ext",
    "downloads": 42
}
```

### Errors
The API might respond with an error object that might or might not be caused by your request. Server errors are indicated by a `5xx` status code and faulty requests are indicated by a `4xx` status codes. Error objects have the following structure:

```json
{
    "error": "<ErrorType>",
    "message": "<An explanation what's wrong.>"
}
```

Common error types:
| Status code | Error type | Explanation |
| --- | --- | --- |
| `404` | `NotFound` | You requested a route that does not exist or used the wrong http verb. |
| `400` | `BadRequest` | Your request does not specify all required parameters correctly. |
| `500` | `ServerError` | Something went wrong on the server end. If this issue persists, please [open an issue](https://github.com/raftmodding/download-counter/issues/new) to let me know. |

## Configuration
You'll need to define the following environment variables. Use a `.env` file in
development environments.

| Variable Name | Description |
| --- | --- |
| `NODE_ENV` | Use `production` for production environments and anything else for development environments. |
| `PORT` | The port to use for the http API server. |
| `TOKEN` | The token/password to use for http authorization to this application. Can be left out in development environments to omit authorization. |
| `MINIO_ACCESS_KEY` | The accessKey / username to use for connecting to the MinIO server. |
| `MINIO_SECRET_KEY` | The secretKey / password to use for connecting to the MinIO server. |
| `MINIO_ENDPOINT` | The MinIO server enpoint. |
| `MINIO_BUCKET_NAME` | The name of the MinIO bucket to watch. |
| `MINIO_PORT` | The of the MinIO endpoint. |
| `MINIO_USE_SSL` | Whether to use HTTPS instead of HTTP. Use `false` to disable SSL. |
| `DATABASE_URL` | Connection string for the postgres database. |
| `SENTRY_DSN` | Sentry logging key. |

## Deployment
I am using [dokku](https://github.com/dokku/dokku) to deploy this app but [Heroku](https://heroku.com) should work too.

0. Install the postgres dokku plugin:
    ```bash
    # on the dokku server
    $ sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
    ```
1. Create a dokku app:
    ```bash
    # on the dokku server
    $ dokku apps:create download-counter
    ```
2. Create, link and initialize postgres database:
    ```bash
    # on the dokku server
    $ dokku postgres:create download-counter-database
    $ dokku postgres:link download-counter-database download-counter
    $ dokku postgres:connect download-counter-database
    # enter the sql script from scripts/db_setup.sql
    # exit with the `exit` command
    ```
3. Configure [required environment variables](#Configuration):
    ```bash
    # on the dokku server
    # do the following for each environment variable
    $ dokku config:set download-counter MINIO_ACCESS_KEY=y0ur_m1n10_4cce55_k3y
    ```
4. Add dokku remote:
    ```bash
    # on your local machine, inside the repo
    $ git remote add dokku dokku@your.dokku.host:download-counter
    ```
5. Deploy:
    ```bash
    # on your local machine, inside the repo
    $ git push dokku
    ```

## License
This project is made available to you by [traxam](https://trax.am) via the [MIT License](./LICENSE).