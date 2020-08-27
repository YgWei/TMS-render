import { Database } from 'arangojs'
import logger from '../logger/system'
import config from '../config'

let connection
const defaultDB = async () => {
  const { protocal, host, port, username, password, database, collection } = config.db
  const url = `${protocal}://${host}:${port}`
  connection = new Database(url)
  connection.useBasicAuth(username, password)

  try {
    logger.info('Checking if database exist, create one if it doesn\'t')
    const List = await connection.listDatabases()
    if (List.indexOf(database) > -1) {
      connection.useDatabase(database)
    } else {
      try {
        logger.info('Database is not exist, creating a new database...')
        await connection.createDatabase(database)
        connection.useDatabase(database)
      } catch {
        logger.error('Exception when creating database')
        throw Error('Exception when creating database')
      }
    }

    const isExist = await connection.collection(collection).exists()
    if (!isExist) {
      logger.info('Collection is not exist, creating a new collection...')
      await connection.collection(collection).create()
    }

  } catch (err) {
    logger.error(err.message || 'Fail on trying to connect with database')
    throw new Error(err.message || 'Fail on trying to connect with database')
  }
  const version = await connection.version()
  const info = { protocal, host, port, database, version }

  logger.info(`Database INFO:`, info)
}
defaultDB()
export default connection
