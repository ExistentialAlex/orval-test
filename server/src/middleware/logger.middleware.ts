import type { MiddlewareHandler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import {
  addRawLogToRequest,
  colorString,
  flushRequestLogs,
  initRequestLogs,
  logError,
  logRequest,
  logResponse,
} from '@/utils';

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.'];

  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`));

  return orderTimes.join(separator);
};

const time = (start: number) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`]);
};

/**
 * Logger Middleware for Hono.
 *
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(logger())
 * app.get('/', (c) => c.text('Hello Hono!'))
 * ```
 */
export const logger = (): MiddlewareHandler => {
  return async function logger(c, next) {
    const { method, url } = c.req;

    const reqID = c.get('requestId');

    const path = url.slice(url.indexOf('/', 8));

    // Initialize request logs
    initRequestLogs(reqID);

    // Add the header log to the collected logs
    const headerLog = colorString(`┌─┤${reqID}├─┤${new Date().toISOString()}│`, 'info');
    addRawLogToRequest(reqID, headerLog);

    logRequest(method, path, reqID);

    const start = Date.now();

    await next();

    logResponse(method, path, c.res.status as StatusCode, time(start), reqID);

    // If an error was thrown, we want to log it for traceability.
    if (c.error) {
      logError(
        method,
        path,
        c.res.status as StatusCode,
        reqID,
        `"${c.error.message}"`,
        c.error.cause ? JSON.stringify(c.error.cause) : '',
      );
    }

    // Add the footer log to the collected logs
    const footerLog = colorString(
      '└──────────────────────────────────────────────────────────────────',
      'info',
    );
    addRawLogToRequest(reqID, footerLog);

    // Flush all logs for this request (prints everything at once)
    flushRequestLogs(reqID);
  };
};
