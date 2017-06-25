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

// 1 - Get All Posts
app.get('/posts', function (req, res) {
  Post.find(function (err, data) {
    if (err) { return console.error(err); }
    res.send(data);
  });
});

// 2 - Add Posts
app.post('/posts', function (req, res) {
  var temp = Object.keys(req.body)[0];;
  var myPost = new Post({
    text: temp,
    comments: []
  });

  Post.findOne({ text: myPost.text }, function (err, data) {
    if (!data) {
      myPost.save(function (err, data) {
        if (err) { return console.error(err); }
        res.send(data);
      });
    }
  });
});

// 3 - Delete Posts
app.delete('/posts/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, data) {
    if (err) { return console.error(err); }
    res.send(data);
  });
});

// 4 - Add Comments
app.post('/posts/:id/comments', function (req, res) {
  Post.findById(req.params.id, function (err, data) {
    if (err) { return console.error(err); }
    data.comments.push(req.body);
    data.save();
    res.send(data);
  });
});

//5 - Delete Comments
app.delete('/posts/:id/comments/:id2', function (req, res) {
  var postID = req.params.id;
  var commentID = req.params.id2;
  Post.findById(postID, function (err, data) {
    if (err) { return console.error(err); }
    data.comments.id(commentID).remove();
    data.save();
    res.send(data);
  });
});

app.listen(8000, function () {
  console.log("What do you want from me! Get me on 8000 ;-)");
});
