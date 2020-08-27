# Render Adapter

## 映射目錄

- logs: /home/node/app/logs。存放 log 的目錄

## Swagger API

- `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/api/v1/swagger-html` . Default is http://localhost:8080/api/v1/swagger-html

1. Install dependency

```
  npm install
```

2. Add enviroment file. File name is .env

```
APP_NAME= Name of the App. Default is RenderAdapter
APP_PORT= Port for this App. Default is 8080

# Log
LOG_FILENAME= Log's save directory. Default is logs
LOG_DIRECTORY= Log's base file name. Default is RenderAdapter
LOG_LEVEL= Log's level. Default is info

# database -- current use ArangoDB
DB_PROTOCAL= DB's internet protocol. Default is http
DB_HOST= DB's Host. Default is 192.168.20.62
DB_PORT= DB's Port. Default is 8530
DB_USERNAME= DB's username account
DB_PASSWORD= DB's password account
DB_DATABASE= which database inside DB we will use

# TMS
TMS_APPSERVER_PROTOCAL= TMS's internet protocol. Default is http
TMS_APPSERVER_HOST= TMS's Host. Default is mtm.belstar.com.cn
TMS_APPSERVER_PORT= TMS's Port. Default is 8080

# local storage
LS_PROTOCOL = local storage's internet protocol. default is http
LS_HOST = local storage's protocol. default is 0.0.0.0
LS_PORT = local storage's protocol. default is 5000
LS_COLLECTION = local storage's protocol. default is tms_tmp

# MQ -- current use RabbitMQ
MQ_HOST= MQ's Host. Default is 192.168.20.62
MQ_PORT= MQ's Port. Default is 5672
sendQueue= MQueue that we will send to. Default is render_vue_pdf
receiveQueue= MQueue that we will listen to. Default is monitor

# Folders
STORAGE_FOLDER=storage folder that we write and save .json file into. Default is storage
```

3. Run the app

```
# Run with development mode
  - npm run dev

#Compiles and minifies for production
  - npm run build
  - npm run start
```
