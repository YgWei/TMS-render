'use strict'
import { SwaggerRouter } from 'koa-swagger-decorator'
import ApiRouter from './api/v1'

const router = new SwaggerRouter()

router.use('/api/v1', ApiRouter.routes())

export default router
