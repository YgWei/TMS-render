var express = require('express')
var fileUpload = require('express-fileupload')
var fs = require('fs-extra')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

app.post('/api/:collection/files/exist', (req, res) => {
  const filesID = req.body.filesID
  console.log(filesID)
  const collection = req.params.collection
  var file = `${__dirname}/files/${collection}/${filesID}`;
  if (fs.existsSync(file)) {
    res.json({ _id: filesID, isExist: true })
    return
  }
  res.json({ _id: filesID, isExist: false })
})

app.get('/api/:collection/download/:id', function (req, res) {
  const colection = req.params.collection
  const id = req.params.id
  var file = `${__dirname}/files/${colection}/${id}`;
  res.download(file);
});

app.use(fileUpload());
app.post('/api/:collection/upload', async function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const colection = req.params.collection
  let file = req.files.file

  const dir = `./files/${colection}`
  fs.ensureDir(dir)

  if (!Array.isArray(file)) {
    file = [file]
  }

  const result = []
  for (const item of file) {
    const path = `${dir}/${item.name}`
    item.mv(path, async function (err) {
      if (err)
        return res.status(500).send(err);
    });
    result.push({
      originalname: item.name,
      md5: item.md5,
      _id: item.name,
      mimetype: item.mimetype
    });
  }
  res.send(result)
});

app.listen(5000, function () {
  console.log('start local storage on 5000 port.')
})