require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

let shortenedLinks = [];

app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:code', function(req, res) {
  const {code} = req.params;
  const result = shortenedLinks[code]
  
  if(result){
    res.writeHead(301, {
      Location: result.original_url
    }).end();
  }else{
     res.json({error: "No short URL found for the given input"});
  }
  
});

app.post('/api/shorturl/', function(req, res) {
  
  const { url } = req.body;
  
  console.log(url)
  
  var urlPattern = /^(https?|http):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[a-zA-Z0-9-]+)*\/?(?:\?[a-zA-Z0-9-]+=[a-zA-Z0-9-]+(?:&[a-zA-Z0-9-]+=[a-zA-Z0-9-]+)*)?$/;

  if (urlPattern.test(url)) {
   
    const short_url = Math.ceil(Math.random() * 100000);
  
    const result = {original_url: url, short_url};
  
    shortenedLinks[short_url]=result;
  
    console.log("Responded with ", result)
    res.json(result);
  } else {
    res.json({ error: 'invalid url' });
  }
  
  
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
