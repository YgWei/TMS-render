// import ArangodbServices from './ArangoDB'
import amqp from 'amqplib'
import config from '../config'
import renderServices from '../services/RenderServices'
import logger from '../logger/system'

const mqUrl = `${config.rabbitMQ.host}:${config.rabbitMQ.port}`

export default class rabbitMQService {
  async sendByQueueAsync(queue, message) {
    const connection = await amqp.connect(`amqp://${mqUrl}`)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)
    try {
      await channel.sendToQueue(queue, Buffer.from(message))
      logger.info(`已发送讯息${message}至${queue}`)
    } catch (err) {
      throw err
    } finally {
      setTimeout(function () {
        connection.close()
      }, 500)
    }
  }

  async receiveMessage(queue) {
    const RenderServices = new renderServices()
    const connection = await amqp.connect(`amqp://${mqUrl}`)
    const channel = await connection.createChannel()
    let result = null
    await channel.prefetch(1)
    await channel.consume(
      queue,
      async function (message) {
        logger.info('Parsing a message from MQ...')
        const msg = message.content.toString()
        try {
          result = JSON.parse(msg)
          await RenderServices.updateDB(result)
          if (result.error_message === undefined) {
            await RenderServices.downloadPDF(result)
          }
        } catch (err) {
          if (err.message) {
            logger.error(`接收讯息时发生未预期的错误: ${err.message}`)
          } else {
            logger.error(`接收讯息时发生未预期的错误: ${err}`)
          }
        }
        channel.ack(message)
      },
      {
        noAck: false
      }
    )
    return result
  }
}
