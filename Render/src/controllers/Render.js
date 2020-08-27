'use strict'
import {
  request,
  summary,
  tags,
  responses,
  body,
  path,
  middlewares
} from 'koa-swagger-decorator'
import validatorMiddleware from '../middlewares/validator'
import * as renderSchema from '../schema/render'
import renderServices from '../services/RenderServices'
import logger from '../logger/system'
import config from '../config'
import { v4 as uuidV4 } from 'uuid'
import fs from 'fs-extra'

const storage = config.folder.storage

/**
 * @typedef {import("koa").Context} Context
 */

const tag = tags(['Render'])

export default class RenderController {

  /**
   * get status of render status base on renderID
   * @param {Context} ctx
   */
  @request('get', '/render/{renderID}')
  @summary('Get status of render status base on renderID')
  @tag
  @path({
    renderID: { type: 'string', required: true }
  })
  @middlewares(validatorMiddleware(renderSchema.checkStatusValidate))
  @responses(renderSchema.checkStatusResponses)
  static async checkStatus(ctx) {
    const RenderServices = new renderServices()
    const renderID = ctx.params.renderID
    try {
      logger.info('從DB拿目前的狀態和資料')
      const data = await RenderServices.getStatus(renderID)

      ctx.status = 200
      ctx.body = { success: data.success, complete: data.complete, fileID: data.fileID, err: data.err }
    } catch (err) {
      ctx.status = err.status
      ctx.body = { success: false, complete: false, err: err.message }
    }
  }

  /**
   * Sending render request to Render engine and save data to DB
   * @param {Context} ctx
   */
  @request('post', '/render')
  @summary('Sending render request to Render engine and save data to DB')
  @body(renderSchema.RenderAdapterBody)
  @middlewares(validatorMiddleware(renderSchema.RenderAdapterBodyValidate))
  @tag
  @responses(renderSchema.RenderAdapterResponses)
  static async startProcess(ctx) {
    const RenderServices = new renderServices()
    const body = ctx.request.body
    body.traceID = uuidV4()
    body.jsonFile = uuidV4()
    try {
      logger.info('Start to get template from tms-client server')
      body.template = await RenderServices.getTemplate(body)

      if (!body.template) {
        ctx.status = 404
        ctx.body = { status: 'fail', err: 'entryPoint not found' }
        return
      }

      const jsonTransformData = await RenderServices.fileProcess(body)

      logger.info('開始到DB存資料。。。')
      await RenderServices.saveData(jsonTransformData, body, 'System')

      logger.info('開始發送訊息到MQ。。。')
      await RenderServices.sendMessageToMQ(jsonTransformData, body)

      ctx.status = 200
      ctx.body = { status: 'success', renderID: body.traceID }
    } catch (err) {
      ctx.status = 500
      ctx.body = { status: 'fail', err: err.message }
    } finally {
      if (fs.existsSync(`${storage}/${body.fileuuid}`)) {
        logger.info(`开始移除storage目錄的檔案`)
        fs.unlinkSync(`${storage}/${body.fileuuid}`)
        if (fs.existsSync(`${storage}/${body.jsonFile}`)) {
          fs.unlinkSync(`${storage}/${body.jsonFile}`)
        }
        logger.info(`storage目錄的檔案移除成功`)
      }
    }
  }
}
