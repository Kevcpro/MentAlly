const WebSocket = require('ws');
var express = require('express')
var app = express()
const wss = new WebSocket.Server({ port: 8080 });
var users = {}

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send(JSON.stringify(users));
});

// respond with "hello world" when a GET request is made to the homepage
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.post('/data', function (req, res) {

  var name = req.body.name

  if (!(name in users)){
      user = new User(name)
      users[name] = user
  }

  var anger = req.body.anger
  var fear = req.body.fear
  var happiness = req.body.happiness
  var sadness = req.body.sadness

  users[name].addEmotions(anger, fear, happiness, sadness)

  wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(users));
      }
  });

  res.send('Success!')

})

app.listen(3000);

class User {
  constructor(name) {
    this.name = name
    this.records = [];
  }

  addEmotions(anger, fear, happiness, sadness){

    var emotion = new Record([anger, fear, happiness, sadness], new Date().toLocaleString());
    console.log(emotion);
    this.records.push(emotion);
  }
}

class Record {
  constructor(emotions, date) {

    this.anger = emotions[0]
    this.fear = emotions[1]
    this.happiness = emotions[2]
    this.sadness = emotions[3]
    this.date = date


  }
}
