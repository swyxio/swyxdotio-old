const express = require('express')
const app = express()
const path = require('path')
const router = require('./routes')

app.use('/', router);
// STATIC fallbacks
app.use('/', express.static('personal'));
// app.use('/images', express.static('images'))
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname+'/index.html'))
// })
const defaultport = process.env.PORT || 1337

app.listen(defaultport, function () {
  console.log('Example app listening on port ' + defaultport)
})
