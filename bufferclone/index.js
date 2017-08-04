const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/testbufferclonedb'
console.log('mongoURL', mongoURL)
mongoose.connect(mongoURL, {
  useMongoClient: true});
const linkModel = require('./schema.js');

const bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


router.use('/bufferclone', express.static('bufferclone/public'));

function makeslug() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// var possible ="🎉🌎😀✨😇🍕😍🚀😎👏🙏"
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

router.post('/buffercloneapi/', function(req, res, next){
    const obj = req.body;
    console.log('req', req.headers)
    console.log('obj', obj)
    const link = {}
    link.agent = req.headers['user-agent'], // User Agent we get from headers
    link.referer = req.headers['referer'], //  Likewise for referrer
    link.ip = req.headers['x-forwarded-for'] || req.connection && req.connection.remoteAddress,
    link.screen = obj.screen;
    link.slug = makeslug();
    link.link_url = obj.link_url ;// "http://google.com";
    link.link_comment = obj.link_comment;
    link.date = new Date();
    link.hits = 0;
    const x = linkModel.create(link, (err, doc) => {
        if (err) return next(err);
        res.json(doc)
    })

    // link.save((err) => {
    //     if (err) res.send('potato tub error')
    //     res.send('saved potato tub')
    // })
})

router.get('/getbuffershortlinks', function (req, res, next){
    linkModel.find({}).sort('date').limit(10).exec(function(err, posts){
        if (err) next(err);
        res.json(posts);
    });
})

router.get('/:slug', function (req, res, next){
    if (req.params.slug.length != 6) {
        res.redirect('/bufferclone')
    }
    else {
        linkModel.findSlug(req.params.slug, (err, x) => {
            if (err) next(err)
            if (x.length === 1) {
                linkModel.findOneAndUpdate({ _id: x[0] }, { $inc: { hits: 1 }})
                    .exec(function(err, db_res) { 
                        if (err) { 
                            throw err; 
                        } 
                        else { 
                            console.log(db_res); 
                        } 
                    });
                res.redirect(x[0].link_url + '?utm_content=swyxdotio&utm_medium=social&utm_source=athnshah&utm_campaign=swyxdotio')
            }
            else
                res.json('slug not found, this is probably an invalid link. Sorry!')
        })
    }
})


module.exports = router;