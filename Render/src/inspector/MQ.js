'use strict'
import config from '../config'
import amqp from 'amqplib'
import logger from '../logger/system'

const mqUrl = `${config.rabbitMQ.host}:${config.rabbitMQ.port}`
const sendQue = config.rabbitMQ.sendQue
const receiveQue = config.rabbitMQ.receiveQue

export default {
  initMQ: async () => {
    try {
      logger.info('Creating Send and Receive Que in MQ')
      const connection = await amqp.connect(`amqp://${mqUrl}`)
      const channel = await connection.createChannel()
      await channel.assertQueue(sendQue, {
        durable: true
      })
      await channel.assertQueue(receiveQue, {
        durable: true
      })
      logger.info('Create Queue complete')
      connection.close()
    } catch (err) {
      if (err.msg) {
        logger.error(`there is an exception when creating a Queue: ${err.msg}`)
        throw new Error(`there is an exception when creating a Queue: ${err.msg}`)
      }
      logger.error(`there is an exception when creating a Queue: ${err}`)
      throw new Error(`there is an exception when creating a Queue: ${err}`)
    }
  }
}