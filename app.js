const express = require('express')
const app = express()
const path = require('path')

app.use('/assets', express.static('assets'))
app.use('/images', express.static('images'))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
