const express = require('express');
const router = express.Router();
const buffer = require('./bufferclone');

router.get('/router', function(req, res, next){
  res.send('Hit the main swyx.io router!')
})

router.use('/', buffer);


// router.param('number', function(req, res, next, id){
//   req.number = id;
//   next();
// });

// router.get('/:number', function(req, res, next){
//   res.json(req.number)
// })



module.exports = router;