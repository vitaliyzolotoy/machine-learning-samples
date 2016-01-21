'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var server = app.listen(3000, function() {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

// A simple echo program:
var csv = require('ya-csv');

app.get('/', function (req, res) {
  var reader = csv.createCsvFileReader('mturk_unlabeled_dataset.csv');
  var lines = 0;
  var tweets = [];

  reader.setColumnNames([ 'tweet', 'id' ]);

  reader.addListener('end', function() {
    res.render('index', { title: 'Hey', message: 'Mark next tweets!', tweets: tweets});
  });

  reader.addListener('data', function(data) {
    lines++;

    tweets.push(data);
  });
});

app.post('/', function (req, res) {
  var writer = new csv.createCsvFileWriter('mturk_labeled_dataset.csv', {
      'quote': ''
  });
  var tweets = req.body;

  writer.writeRecord([ 'AssignmentStatus', 'Input.id', 'Answer.Q3Answer' ]);

  for (let tweet in tweets) {
    var item = tweets[tweet];

    writer.writeRecord([item['AssignmentStatus'], item['Input.id'], item['Answer.Q3Answer']]);
  };

  res.send('saved');
});
