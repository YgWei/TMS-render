'use strict'
import inspector from './inspector'
import fileWatcher from './services/fileWatcher'
import monitor from './services/monitor'

(async () => {
  inspector.beforeStart()
  fileWatcher.startWatcher()
  monitor.startQueue()
})()