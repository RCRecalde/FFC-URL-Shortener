require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns')
const urlparser = require('url')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
/* conect mongodb */
let uri = process.env.MONGO_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const schema = new mongoose.Schema({ url: 'string' })
const Url = mongoose.model('Url', schema)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(req.body)
  const bodyUrl = req.body.url

  //parsear la url que viene por el body  y enviarla a dns para que analice el hostname
  const something = dns.lookup(urlparser.parse(bodyUrl).hostname, (err, address) => {
    if (!address) {
      res.json({ error: "Invalid URL" })
    } else {
      //captamos la url y la guardamos en db
      const url = new Url({ url: bodyUrl })
      url.save((err, data) => {
        res.json({
          original_url: data.url, short_url: data.id
        })

      }
      )

    }
    console.log('dns', err)
    console.log('address', address)
  })
  console.log('something', something)


});

app.get('/api/shorturl/:id', (req, res)=> {
  const id =req.params.id
  Url.findById(id, (err, data)=> {
    if(!data){
      res.json({err: 'Invalid URL'})
    }else{
    res.redirect(data.url)
    }
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
