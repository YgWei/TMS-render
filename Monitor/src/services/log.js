'use strict'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import config from '../config'

const directory = config.log.directory
const fileName = config.log.fileName
const logLevel = config.log.logLevel

const format = winston.format

const log = winston.createLogger({
    level: logLevel,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new (DailyRotateFile)({
            filename: `${fileName}.%DATE%.log`,
            dirname: directory,
            datePattern: 'YYYY-MM-DD',
        })
    ]
})

export default log