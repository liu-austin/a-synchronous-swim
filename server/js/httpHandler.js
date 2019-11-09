const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const validMessages = ['left', 'right', 'up', 'down'];
const messages = require('./messageQueue.js');
const formidable = require('formidable');

// /Arrow(Up|Down|Left|Right)/
// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, headers);
    var msg = messages.dequeue();
    if (msg) {
      res.write(msg);
    } else {
      messages.enqueue('yo');
      res.write(messages.dequeue());
      res.end();
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.method === 'GET') {
    fs.readFile('.' + req.url, function(err, data) {
      if (err) {
        res.writeHead(404, headers);
      } else {
        res.writeHead(200, headers);
        res.write(data, 'binary');
      }
      res.end();
    });
  } else if (req.method === 'POST') {
    res.writeHead(201, headers);
    // let body = [];
    let body = Buffer.alloc(0);
    // req.on('data', chunk => body.push(chunk));
    req.on('data', chunk => {body = Buffer.concat([body, chunk])});
    req.on('end', () => {
      let buffer = Buffer.concat(body);
      let file = multipart.getFile(buffer);
      fs.writeFile('./background.jpg', file.data);
    });

    }
    next(); // invoke next() at the end of a request to help with testing!
  };




