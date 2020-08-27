'use strict'
import logger from '../logger/system'

/**
 * @typedef {import("koa").Middleware} Middleware
 * @typedef {import("koa").Context} Context
 */

/**
 * Handler unhandler exception.
 * @return {Middleware}
 */
export default () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = {
        err: err.message
      }
      logErrorObject(ctx, err)
    }
  }
}

/**
 * Log request error
 * @param {Context} ctx
 * @param {Error} err
 */
function logErrorObject(ctx, err) {
  const errorObject = {
    message: 'Request error event',
    requestID: ctx.response.get('X-Request-ID'),
    status: ctx.status,
    err: err.message
  }
  logger.error(errorObject)
}
