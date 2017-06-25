var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: String,
    username: String
});

var postSchema = new Schema({
    text: String,
    comments: [commentSchema]
});

var Comment = mongoose.model('Comment', commentSchema);

var Post = mongoose.model('Post', postSchema);

module.exports = Post;