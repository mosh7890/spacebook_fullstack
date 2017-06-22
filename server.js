var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/day4_spacebook_fullstack', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel.js');
var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
});

app.get('/posts', function (req, res) {
  Post.find({}).exec(function (err, found) {
    if (err) { return console.error(err); }
    res.send(found);
  });
});

app.post('/posts', function (req, res) {
  var temp = Object.keys(req.body)[0];;
  var myPost = new Post({
    text: temp,
    comments: []
  });

  Post.findOne({ text: myPost.text }, function (err, found) {
    if (!found) {
      myPost.save(function (err, result) {
        if (err) { return console.error(err); }
        console.log('New Post');
        console.log(result);
      });
      res.send();
    }
    else {
      console.log('Found Post!, Not Saving!');
    }
  });
});

app.post('/posts/:id/comments', function (req, res) {
  var id = req.params.id;
  var myComment = req.body;
  Post.findById(id, function (err, found) {
    if (err) { return console.error(err); }
    found.comments.push(myComment);
    found.save();
  });
  res.send();
});

app.delete('/posts/:id', function (req, res) {
  var id = req.params.id;
  Post.findByIdAndRemove(id, function (err, result) {
    if (err) { return console.error(err); }
    res.send();
  });
});

app.delete('/posts/:id/comments/:id2', function (req, res) {
  var postID = req.params.id;
  var commentID = req.params.id2;
  Post.findById(postID, function (err, result) {
    if (err) { return console.error(err); }
    result.comments.id(commentID).remove();
    result.save();
  });
  res.send();
});

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});
