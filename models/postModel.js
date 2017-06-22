var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
    text: String,
    username: String
});

var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema]
});

var Comment = mongoose.model('Comment', commentSchema);

var Post = mongoose.model('Post', postSchema);

module.exports = Post;