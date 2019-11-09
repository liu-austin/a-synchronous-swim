const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const validMessages = ['left', 'right', 'up', 'down'];
const messages = require('./messageQueue.js');

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
    }
  } else if (req.method === 'GET') {
    fs.readFile(req.url.slice(1), function(err, data) {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(data);
    });
  } else if (req.method === 'POST') {

    // res.writeHead(200, {'Content-Type': 'image/jpeg'});
    // fs.readFile()
  }
  // res.write(validMessages[Math.round(Math.random()*3)]);

  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
