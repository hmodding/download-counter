import { init } from '@sentry/node';
import '@sentry/tracing';
import { getConfiguration } from './environment-configuration';
import { createModuleLogger } from './logger';

const logger = createModuleLogger('sentry');

/**
 * Configures Sentry with the SENTRY_DSN environment variable.
 */
export function configureSentry(): void {
  const config = getConfiguration()
  const dsn = config.sentryDSN;
  const environment = config.environment;

  init({
    dsn,
    tracesSampleRate: 1.0,
    environment,
  });
  logger.info('Sentry configured!');
}
