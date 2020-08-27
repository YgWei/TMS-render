'use strict'
import dotenv from 'dotenv'
import fs from 'fs-extra'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const baseWatchConfig = JSON.parse(fs.readFileSync('config/watch.json'))

const configs = {
  base: {
    env,
    baseWatchConfig,
    folder: {
      input: process.env.INPUT_FOLDER || 'input',
      archive: process.env.ARCHIVE_FOLDER || 'archive',
      error: process.env.ERROR_FOLDER || 'error',
    },
    parallelCount: {
      add: process.env.ADD_PROCESS_PARALLEL_COUNT || 1
    },
    log: {
      directory: process.env.LOG_DIRECTORY || 'logs',
      fileName: process.env.LOG_FILENAME || 'RenderMonitor',
      logLevel: process.env.LOG_LEVEL || 'info'
    },
    renderAdapter: {
      protocol: process.env.ADAPTER_PROTOCOL || 'http',
      host: process.env.ADAPTER_HOST || '0.0.0.0',
      port: process.env.ADAPTER_PORT || 8080,
    },
    localStorage: {
      protocol: process.env.LS_PROTOCOL || 'http',
      host: process.env.LS_HOST || '0.0.0.0',
      port: process.env.LS_PORT || 5000,
      collection: process.env.LS_COLLECTION || 'tms_tmp',
    },
    production: {
      version: process.env.TMS_VERSION || 'latest'
    }
  },
  production: {
  },
  development: {
  },
  test: {
  }
}
const config = Object.assign(configs.base, configs[env])

export default config

