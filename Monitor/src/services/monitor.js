import config from '../config'
import fs from 'fs-extra'
import logger from './log'
import events from 'events'
import path from 'path'
import request from 'request-promise'
import localStorage from '../util/LocalStorage'

const jobQueueArray = []

const input = config.folder.input
const error = config.folder.error
const archive = config.folder.archive

const eventEmitter = new events.EventEmitter()

export default {
  startQueue: () => {
    const addEventProcParCount = config.parallelCount.add
    for (let i = 0; i < addEventProcParCount; i++) {
      eventEmitter.emit('watchJobQueue')
    }
  },
  pushElement: element => {
    jobQueueArray.push(element)
  }
}

async function startSendQueue() {
  if (jobQueueArray.length === 0) {
    await delay(5000)
    return
  }

  let filePath = jobQueueArray.shift()
  const fileName = path.basename(filePath)

  try {
    logger.info('Start uploading file to local storage...')
    await saveFile(fileName)

    await requestRender(fileName)

    fs.moveSync(`${input}/${fileName}`, `${archive}/${fileName}`, { overwrite: true })

  } catch (err) {
    if (err.message) {
      logger.error(`创建讯息错误: ${err.message}`)
      fs.moveSync(`${input}/${fileName}`, `${error}/${fileName}`, { overwrite: true })
    } else {
      logger.error(`创建讯息错误: ${err}`)
      fs.moveSync(`${input}/${fileName}`, `${error}/${fileName}`, { overwrite: true })
    }
    return
  }
}

eventEmitter.on('watchJobQueue', async function () {
  try {
    await startSendQueue()
  } catch (err) {
    if (err.message) {
      logger.error(`处理工作伫列时发生未预期的错误: ${err.message}`)
    } else {
      logger.error(`处理工作伫列时发生未预期的错误: ${err}`)
    }
  }
  eventEmitter.emit('watchJobQueue')
})

function delay(s) {
  return new Promise(function (resolve) {
    setTimeout(resolve, s);
  })
}

async function saveFile(fileName) {
  const LocalStorage = new localStorage(config.localStorage)

  await LocalStorage.upload([`${input}/${fileName}`])
  logger.info('Upload completed')
}

async function requestRender(fileName) {
  logger.info('Sending request to adapter...')
  const uri = `${config.renderAdapter.protocol}://${config.renderAdapter.host}:${config.renderAdapter.port}`
  const options = {
    method: 'POST',
    url: `${uri}/api/v1/render`,
    headers:
    {
      'Content-Type': 'application/json'
    },
    body: {
      company: 'jk',
      production: 'jkdjk',
      version: config.production.version,
      fileuuid: fileName,
      outFormat: 'pdf'
    },
    json: true
  }
  try {
    await request(options)
    logger.info('Sending request to adapter success.')
    return
  } catch (err) {
    logger.error('Requesting to adapter failed')
    throw err
  }
}
