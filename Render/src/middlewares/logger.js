'use strict'
import logger from '../logger/request'
/**
 * @typedef {import("koa").Middleware} Middleware
 * @typedef {import("koa").Context} Context
 */

/**
 * Return middleware that logs HTTP request/response.
 * @return {Middleware} Koa middleware.
 */
export default () => {
  return async (ctx, next) => {
    if (ctx.path.match(/swagger/)) {
      await next()
      return
    }
    logRequestObject(ctx)
    await next()
    logResponseObject(ctx)
  }

  /**
   * Log request
   * @param {Context} ctx
   */
  function logRequestObject(ctx) {
    const requestObject = {
      message: 'Request event',
      method: ctx.method,
      path: ctx.path,
      url: ctx.url,
      headers: ctx.headers,
      protocol: ctx.protocol,
      ip: ctx.ip,
      query: ctx.query,
      body: ctx.request.body,
      requestID: ctx.response.get('X-Request-ID')
    }
    logger.info(requestObject)
  }
}

/**
 * Log response
 * @param {Context} ctx
 */
function logResponseObject(ctx) {
  const responseObject = {
    message: 'Response event',
    status: ctx.status,
    requestID: ctx.response.get('X-Request-ID'),
    headers: (ctx.response || {}).headers,
    type: ctx.type
  }
  // Only log json body
  if (ctx.response.get('Content-Type').includes('application/json')) {
    responseObject.body = ctx.body
  }
  logger.info(responseObject)
}
