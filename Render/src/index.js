'use strict'
import Koa from 'koa'
import cors from 'kcors'
import routers from './routers'
import bodyParser from 'koa-bodyparser'
import requestID from './middlewares/requestID'
import httpLogger from './middlewares/logger'
import errorHandler from './middlewares/errorHandler'
import config from './config'
import inspector from './inspector'
import MQ from './inspector/MQ'
import listen from './services/listen'

(async () => {
  inspector.check()
  await MQ.initMQ()
  const app = new Koa()

  await listen.startListen()

  app.use(errorHandler())
  app.use(bodyParser())
  app.use(requestID())
  app.use(
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      exposeHeaders: ['X-Request-Id']
    })
  )
  app.use(httpLogger())
  app.use(routers.routes()).use(routers.allowedMethods())
  app.listen(config.port, () => {
    console.log('service start')
  })
})()

