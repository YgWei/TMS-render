'use strict'
import fs from 'fs-extra'
import config from '../config'
import logger from '../services/log'

const folderConfig = config.folder

export default {
  beforeStart() {
    logger.info('开始服务启动前检查...')
    for (const folder in folderConfig) {
      if (!fs.existsSync(folder)) {
        logger.warn(`${folder}目录不存在，将自动建立目录`)
        fs.mkdirSync(folder)
      }
    }
    logger.info('启动前检查完成')
  }
}