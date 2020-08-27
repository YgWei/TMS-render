'use strict'
import { v1 as uuidv1 } from 'uuid'

/**
 * @typedef {import("koa").Middleware} Middleware
 */

/**
 * Return middleware that gets an unique request id from a header or
 * generates a new id.
 *
 * @param {Object} [options] Optional configuration.
 * @param {function} [options.generator] ID generator function.
 * @return {Middleware} Koa middleware.
 */
export default (options = {}) => {
  const {
    generator = uuidv1
  } = options

  return async (ctx, next) => {
    const requestIDHeader = 'X-Request-ID'
    const requestID = ctx.request.get(requestIDHeader) || generator()
    ctx.set(requestIDHeader, requestID)
    await next()
  }
}
