import fs from 'fs-extra'
import request from 'request-promise'
import md5 from 'md5-promised'
import logger from '../services/log'
// import conf from '../config'

export default class LocalStorage {
  constructor(config) {
    if (!config || !config.protocol || !config.host || !config.port) {
      logger.error('Cloudstorage constructor config can\'t empty.')
      throw Error('Cloudstorage constructor config can\'t empty.')
    }
    this.baseUrl = `${config.protocol}://${config.host}:${config.port}`
    this.collection = config.collection
    this.api = {
      upload: `${this.baseUrl}/api/${this.collection}/upload`
    }
  }

  async upload(files) {
    if (!Array.isArray(files)) {
      logger.error('files must be array')
      throw Error('files must be array')
    }
    const uploadResult = await this._uploadRequest(files)
    const checkMd5 = await this._checkMD5s(files, uploadResult)

    if (checkMd5) {
      logger.debug('local storage upload', uploadResult)
      return uploadResult
    } else {
      throw Error('upload file error, md5 is not equal')
    }
  }

  async _checkMD5s(files, uploadResult) {
    for (const index in uploadResult) {
      const uploadMD5 = uploadResult[index].md5
      const localMD5 = await md5(files[index])
      if (uploadMD5 !== localMD5) {
        return false
      }
    }
    return true
  }

  async _uploadRequest(files) {
    const paths = []
    for (const item of files) {
      const stream = await fs.createReadStream(item)
      paths.push(stream)
    }

    const options = {
      method: 'POST',
      uri: this.api.upload,
      formData: {
        file: paths
      },
      json: true
    }

    const res = await request(options)
    return res
  }
}