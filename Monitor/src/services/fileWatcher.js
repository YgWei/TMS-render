'use strict'
import watcherUtil from '../util/watcher'
import config from '../config'
import path from 'path'
import logger from './log'
import monitor from './monitor'

// get custom configuration
const baseWatchConfig = config.baseWatchConfig
const inputFolder = config.folder.input

// initial watcher
export default {
	startWatcher: () => {
		const inputWatcher = watcherUtil.createWatcher(inputFolder, baseWatchConfig)
		inputWatcher
			.on('add', async filePath => {
				if (path.extname(filePath) === '.xml') {
					logger.info(`档案 ${filePath} 被加入`)
					monitor.pushElement(filePath)
				}
			})
	}
}