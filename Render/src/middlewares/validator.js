'use strict'
/**
 * @typedef {import("koa").Middleware} Middleware
 */

/**
 * Validate schema
 * @return {Middleware} Koa middleware.
 */
export default (schemas, options = {}) => {
  options = {
    ...options,
    abortEarly: false,
    allowUnknown: true
  }

  return async (ctx, next) => {
    for (const key in schemas) {
      const joiObject = schemas[key]
      switch (key) {
        case 'params':
          try {
            await joiObject.validateAsync(ctx.params)
          } catch (err) {
            ctx.throw(400, err.message)
          }
          break
        case 'body':
          try {
            await joiObject.validateAsync(ctx.request.body)
          } catch (err) {
            ctx.throw(400, err.message)
          }
          break
        default:
          break
      }
    }

    await next()
  }
}
