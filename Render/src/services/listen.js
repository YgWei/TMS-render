import config from '../config'
import logger from '../logger/system'
import rabbitMQService from '../util/MQService'

const receiveQue = config.rabbitMQ.receiveQue

export default {
  startListen: async () => {
    const rabbitMQ = new rabbitMQService()
    try {
      logger.info(`开始监听${receiveQue}`)
      await rabbitMQ.receiveMessage(receiveQue)
    } catch (err) {
      if (err.message) {
        logger.error(err.message)
      } else {
        logger.error(err)
      }
      return
    }
  }
}
