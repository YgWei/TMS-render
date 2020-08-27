'use strict'
import fs from 'fs-extra'
import config from '../config'

export default {
  check: () => {
    for (const key in config.folder) {
      const folder = config.folder[key]
      if (!fs.existsSync(folder)) {
        fs.mkdir(folder)
      }
    }
  }
}
