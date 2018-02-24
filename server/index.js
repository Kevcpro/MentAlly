const WebSocket = require('ws');
var express = require('express')
var app = express()
const wss = new WebSocket.Server({ port: 8080 });
var users = {}

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
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
  var contempt = req.body.contempt
  var disgust = req.body.disgust
  var fear = req.body.fear
  var happiness = req.body.happiness
  var neutral = req.body.neutral
  var sadness = req.body.sadness
  var surprise = req.body.surprise

  users[name].addEmotions(anger, contempt, disgust, fear, happiness, neutral, sadness, surprise)

  console.log(req.body.anger)

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

  addEmotions(anger, contempt, disgust, fear, happiness, neutral, sadness, surprise){

    var emotion = new Record([anger, contempt, disgust, fear, happiness, neutral, sadness, surprise]);
    this.records.push(emotion);
  }
}

class Record {
  constructor(emotions) {

    this.anger = emotions[0]
    this.contempt = emotions[1]
    this.disgust = emotions[2]
    this.fear = emotions[3]
    this.happiness = emotions[4]
    this.neutral = emotions[5]
    this.sadness = emotions[6]
    this.surprise = emotions[7]
  }
}
