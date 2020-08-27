'use strict'

export class DBConnectionFail extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DBConnectionFail'
    this.message = message ? message : 'Can\'t connect to Database'
    this.stack = (new Error()).stack
    this.data = { _key: data }
  }
}

export class DataNotFoundException extends Error {
  constructor(message, data) {
    super()
    this.status = 404
    this.name = 'DataNotFoundException'
    this.message = message ? `Can't find render status by ${message}` : 'Data not found'
    this.stack = (new Error()).stack
    this.data = { _key: data }
  }
}

export class DataSaveError extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataSaveError'
    this.message = message || 'Data save fail.'
    this.stack = (new Error()).stack
    this.data = data
  }
}

export class DataUpdateError extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'DataUpdateError'
    this.message = message || 'Data update fail.'
    this.stack = (new Error()).stack
    this.data = data
  }
}

export class MQ_SERVICE_FAIL extends Error {
  constructor(message, data) {
    super()
    this.status = 500
    this.name = 'MQServiceFail'
    this.message = message || 'Fail on sending message to MQ'
    this.stack = (new Error()).stack
    this.data = data
  }
}