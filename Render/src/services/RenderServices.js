'use strict'
import Services from './Services'
import config from '../config'
import logger from '../logger/system'
import request from 'request-promise'
import fs from 'fs-extra'
import xml2js from 'xml2js'
import jsonTransformer from '../util/jsonTransformer'
import rabbitMQService from '../util/MQService'
import localStorage from '../util/LocalStorage'
import { DataNotFoundException } from '../exception'

const storage = config.folder.storage
const output = config.folder.output
const sendQue = config.rabbitMQ.sendQue

export default class RenderServices extends Services {
  constructor() {
    super(`${config.db.collection}`)
  }

  async getTemplate(body) {
    const uri = `${config.tmsAppserver.protocol}://${config.tmsAppserver.host}:${config.tmsAppserver.port}`

    const options = {
      method: 'GET',
      uri: `${uri}/api/preprocess/check`,
      qs: {
        company: body.company,
        production: body.production,
        version: body.version === 'latest' ? undefined : body.version
      },
      json: true
    }
    let checked = ''
    try {
      checked = await request(options)
      logger.info('Get template success')
    } catch (err) {
      logger.error(`Get template failed: ${err}`)
      throw new Error(`Get template failed: ${err}`)
    }

    return checked.data
  }

  async fileProcess(body) {
    const LocalStorage = new localStorage(config.localStorage)
    try {
      logger.info('Download xml File from local storage')
      await LocalStorage.download(body.fileuuid, storage, body.fileuuid)
    } catch (err) {
      logger.error(err.message || 'Fail on trying to download xml file')
      throw new Error(err.message || 'Fail on trying to download xml file')
    }

    let jsonFile
    try {
      logger.info('Start to convert xml file into json file')
      const xmlFile = fs.readFileSync(`${storage}/${body.fileuuid}`)
      const parsedXML = await xml2js.parseStringPromise(xmlFile, { mergeAttrs: true, explicitArray: false });
      jsonFile = JSON.stringify(parsedXML)
    } catch {
      logger.error('Fail on converting xml file')
      throw new Error('Fail on converting xml file')
    }

    try {
      logger.info('存json檔案到storage目錄')
      fs.writeFileSync(`${storage}/${body.jsonFile}`, jsonFile);
    } catch {
      logger.error('Fail on saving json file to storage folder')
      throw new Error('Fail on saving json file to storage folder')
    }

    try {
      logger.info('upload json file to local storage')
      await LocalStorage.upload([`${storage}/${body.jsonFile}`])
      logger.info('Upload completed')
    } catch (err) {
      logger.error(`Fail on uploading json file to local storage: ${err.message}`)
      throw new Error(`Fail on uploading json file to local storage: ${err.message}`)
    }

    return JSON.parse(jsonFile)
  }

  async saveData(jsonTransformData, body, user) {
    const renderDataBody = {
      _key: body.traceID,
      company: body.company,
      category: body.production,
      render_type: body.outFormat,
      status: 'rendering', // rendering || complete || error
      meta: {},
      info: {
        fileName: body.fileuuid.replace('.xml', ''), // xml
        printtype: jsonTransformData.policyinfo.printtype, // get from xml. policyinfo.printtype
        productionType: jsonTransformData.policyinfo.productionInfo.type,
        company: jsonTransformData.policyinfo.productionInfo.company,
        version: jsonTransformData.policyinfo.version,
        tms: {
          company: body.company,
          production: body.production,
          version: body.template.version,
          projectId: body.template.projectId,
          entryPoint: body.template.entrypoint
        },
        tmsTraceID: body.traceID
      },
      render_src_files: [
        body.jsonFile // jsonid
      ]
    }

    await super.create(renderDataBody, user)
  }

  async sendMessageToMQ(jsonTransformData, body) {
    const rabbitMQ = new rabbitMQService()
    const genMessage = jsonTransformer.toMsg(jsonTransformData, body)

    try {
      await rabbitMQ.sendByQueueAsync(sendQue, genMessage)
    } catch (err) {
      if (err.message) {
        logger.error(`发送讯息错误: ${err.message}`)
        throw new Error(err.message)
      } else {
        logger.error(`发送讯息错误: ${err}`)
        throw new Error(err)
      }
    }
  }

  async updateDB(messages) {
    try {
      logger.info('Updating data of a specific document on DB...')
      const updateDataBody = {
        status: messages.error_message !== undefined ? 'error' : 'complete',
        render_dest_files: messages.render_dest_files,
        error_message: messages.error_message
      }
      await super.update(messages.request_id, updateDataBody, 'System')
      logger.info('Update Complete...')
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async downloadPDF(messages) {
    const LocalStorage = new localStorage(config.localStorage)
    try {
      logger.info('Download PDF render result to output folder')
      await LocalStorage.download(messages.render_dest_files[0], output, messages.render_dest_files[0])
      await LocalStorage.download(messages.render_dest_files[1], output, messages.render_dest_files[1])
      logger.info('Download PDF Complete...')
    } catch (err) {
      logger.error(err.message || 'Fail on trying to download PDF file')
      throw new Error(err.message || 'Fail on trying to download PDF file')
    }
  }

  async getStatus(renderID) {
    const renderResult = await this.get(renderID)

    if (renderResult.length !== 1) {
      logger.info(`Can't find render status by ${renderID}`)
      throw new DataNotFoundException(`${renderID}`)
    }

    let resBody
    switch (renderResult[0].status) {
      case 'complete':
        resBody = {
          success: true,
          complete: true,
          fileID: renderResult[0].render_dest_files[0]
        }
        break
      case 'error':
        resBody = {
          success: false,
          complete: true,
          err: renderResult[0].error_message
        }
        break
      default:
        resBody = {
          success: false,
          complete: false
        }
        break
    }

    return resBody
  }
}
