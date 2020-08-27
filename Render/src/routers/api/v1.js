'use strict'
import { SwaggerRouter } from 'koa-swagger-decorator'
import RenderController from '../../controllers/Render'

const router = new SwaggerRouter()

router.swagger({
  title: 'Service API doc',
  description: 'Service API doc',
  version: 'v1.0.0',

  // [optional] default is root path.
  prefix: '/api/v1',

  // [optional] default is /swagger-html
  swaggerHtmlEndpoint: '/swagger-html',

  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/swagger-json'
})

router.map(RenderController, { doValidation: false })

export default router
