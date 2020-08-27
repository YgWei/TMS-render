# Render Monitor

## 映射目錄

- logs: /home/node/app/logs。存放 log 的目錄
- input: /home/node/app/input。Folder that are being watched by watcher to get XML file.
- error: /home/node/app/error。Folder where we put fail processed XML file.
- archive: /home/node/app/archive。Folder where we put success processed XML file

1. Install dependency

```
  npm install
```

2. Add enviroment file. File name is .env

```
APP_NAME= Name of the App

# Log
LOG_FILENAME= Log's save directory. Default is logs
LOG_DIRECTORY= Log's base file name. Default is RenderMonitor
LOG_LEVEL= Log's level. Default is info

# Parallel count config
ADD_PROCESS_PARALLEL_COUNT= Number of parallel process the app will use

# render adapter
ADAPTER_PROTOCOL = adapter's internet protocol. default is http
ADAPTER_HOST = adapter's host. default is 0.0.0.0
ADAPTER_PORT = adapter's port. default is 8080

# local storage
LS_PROTOCOL = local storage's internet protocol. default is http
LS_HOST = local storage's protocol. default is 0.0.0.0
LS_PORT = local storage's protocol. default is 5000
LS_COLLECTION = local storage's protocol. default is tms_tmp

# Folders
INPUT_FOLDER=input folder that we gonna monitor
ARCHIVE_FOLDER=archive folder that we gonna volume to adapter
ERROR_FOLDER=error folder that we gonna move file into when there's an error happened

# TMS
TMS_VERSION= tms api version. Default is latest.
Note: If you want an older version, just put the correct older version.
```

3. According to example, setup config/watch.json

```
# config/watch.json
{
  "usePolling": true,
  "interval": 1000,
  "binaryInterval": 1000,
  "stabilityThreshold": 3000,
  "pollInterval": 1000,
  "depth": 1
}
```

4. Run the app

```
# Run with development mode
  - npm run dev

#Compiles and minifies for production
  - npm run build
  - npm run start
```

5. Input the xml files with json file inside to the folder that we set on .env. Default is input
