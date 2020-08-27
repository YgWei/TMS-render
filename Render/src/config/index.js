'use strict'
import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const configs = {
  base: {
    logger: {
      fileName: process.env.LOG_FILENAME || 'RenderAdapter',
      directory: process.env.LOG_DIRECTORY || 'logs',
      level: process.env.LOG_LEVEL || 'info'
    },
    folder: {
      storage: process.env.STORAGE_FOLDER || 'storage',
      output: process.env.OUTPUT_FOLDER || 'output'
    },
    rabbitMQ: {
      host: process.env.MQ_HOST || '192.168.20.62',
      port: process.env.MQ_PORT || '5672',
      sendQue: process.env.sendQueue || 'render_vue_pdf',
      receiveQue: process.env.receiveQueue || 'monitor'
    },
    tmsAppserver: {
      protocol: process.env.TMS_APPSERVER_PROTOCOL || 'http',
      host: process.env.TMS_APPSERVER_HOST || '192.168.51.29',
      port: process.env.TMS_APPSERVER_PORT || '8482'
    },
    localStorage: {
      protocol: process.env.LS_PROTOCOL || 'http',
      host: process.env.LS_HOST || '0.0.0.0',
      port: process.env.LS_PORT || 5000,
      collection: process.env.LS_COLLECTION || 'tms_tmp',
    },
    port: process.env.APP_PORT || 8080
  },
  production: {
    db: {
      protocal: process.env.DB_PROTOCOL || 'http',
      host: process.env.DB_HOST || '0.0.0.0',
      port: process.env.DB_PORT || 8530,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'TMS_Adapter',
      collection: process.env.DB_COLLECTION || 'RenderJob',
    }
  },
  development: {
    db: {
      protocal: process.env.DB_PROTOCOL || 'http',
      host: process.env.DB_HOST || '0.0.0.0',
      port: process.env.DB_PORT || 8530,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'TMS_Adapter',
      collection: process.env.DB_COLLECTION || 'RenderJob'
    }
  },
  test: {
  }
}
const config = Object.assign(configs.base, configs[env])

export default config
