import fs from 'fs-extra'
import request from 'request-promise'
import md5 from 'md5-promised'
import logger from '../logger/system'
// import conf from '../config'

export default class LocalStorage {
  constructor(config) {
    if (!config || !config.protocol || !config.host || !config.port) {
      throw Error('Cloudstorage constructor config can\'t empty.')
    }
    this.baseUrl = `${config.protocol}://${config.host}:${config.port}`
    this.collection = config.collection || 'tms_tmp'
    this.api = {
      upload: `${this.baseUrl}/api/${this.collection}/upload`,
      download: (id) => `${this.baseUrl}/api/${this.collection}/download/${id}`
    }
  }

  async upload(files) {
    if (!Array.isArray(files)) {
      logger.error('Upload fail, files must be array')
      throw Error('Upload fail, files must be array')
    }
    const uploadResult = await this._uploadRequest(files)
    const checkMd5 = await this._checkMD5s(files, uploadResult)

    if (checkMd5) {
      logger.debug('local storage upload', uploadResult)
      return uploadResult
    } else {
      logger.error('upload file error, md5 is not equal')
      throw Error('upload file error, md5 is not equal')
    }
  }

  async download(id, path, rename) {
    const download = await this._downloadRequest(id)
    const fileName = decodeURIComponent(download.headers['filename'])

    const localFilePath = `${path}/${rename || fileName}`
    await fs.writeFile(localFilePath, download.body)

    return {
      fileName: rename || fileName,
      localFilePath
    }
  }

  async _downloadRequest(id) {
    const url = encodeURI(this.api.download(id))
    const options = {
      method: 'GET',
      uri: url,
      resolveWithFullResponse: true
    }
    const res = await request(options)
    return res
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
