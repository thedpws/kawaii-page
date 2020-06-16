
const http = require('http');
const booru = require('booru');
const url = require('url')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3939;
const request = require('request').defaults({ encoding: null });

app.use(bodyParser.json());


app.use(express.static('public'))



let kawaiiCache = [];

app.get('/kawaii', (req, res) => {
  res.send(kawaiiCache.shift());
  cacheKawaii();
});

function cacheKawaii(){
  const MAXIMUM_KAWAII = 10;

  if (kawaiiCache.length >= MAXIMUM_KAWAII)
    return;

  console.log('getting kawaiis')

  booru
    .search('safebooru', ['loli'], {limit: MAXIMUM_KAWAII - kawaiiCache.length, random: true})
    .then(kawaiis => {
      for (let kawaii of kawaiis){
        request.get(kawaii.fileUrl, (err, res, buffer) => {
          kawaiiCache.push(buffer);
          console.log(kawaiiCache.length);
        });
      }
    })
    .catch(err => console.log(err));
}

cacheKawaii();

app.listen(port, () => console.log('Port 3939 is now the most kawaii port on this machine.'));
