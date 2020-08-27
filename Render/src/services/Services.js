import connection from '../connection'
import { DataUpdateError, DataSaveError, DBConnectionFail } from '../exception'
import logger from '../logger/system'
export default class Services {
  constructor(collection) {
    this.db = connection
    this.col = collection
    this.collection = connection.collection(collection)
  }

  async get(_id) {
    try {
      const query = `FOR render IN ${this.col}
                    FILTER render.info.tmsTraceID == @tmsTraceID
                    LIMIT 1
                      RETURN {
                        "status": render.status,
                        "error_message": render.error_message,
                        "render_dest_files": render.render_dest_files}`
      const params = { 'tmsTraceID': _id }
      const result = await this.db.query(query, params)
      return result._result
    } catch (err) {
      logger.error('Can\'t connect to database.')
      throw new DBConnectionFail()
    }
  }

  async create(data, user, opt) {
    if (!user) {
      logger.error('user can\'t be empty')
      throw new Error('user can\'t be empty')
    }
    data = {
      ...data,
      createTime: new Date(),
      createUser: user
    }
    try {
      const res = await this.collection.save(data, { returnNew: true, ...opt })
      return res
    } catch (err) {
      logger.error(`Exception when saving data to DB: ${err}`)
      throw new DataSaveError(`Exception when saving data to DB: ${err}`)
    }
  }

  async update(_key, data, user, opt) {
    if (!user) {
      logger.error('user can\'t be empty')
      throw new Error('user can\'t be empty')
    }
    data = {
      ...data,
      modifyTime: new Date(),
      modifyUser: user
    }
    try {
      const res = await this.collection.update(_key, data, { returnNew: true, ...opt })
      return res
    } catch (err) {
      logger.error('Exception when update data to DB')
      throw new DataUpdateError('Exception when update data to DB')
    }
  }
}
