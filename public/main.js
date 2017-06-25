var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  // Get Posts and Comments 
  var fetch = function () {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  // First Page Load - Render Existing Posts and Comments
  _renderPosts();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  // Add a Post
  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: '/posts',
      data: newPost,
      success: function (data) {
        posts.push(data);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  // Delete a Post
  var removePost = function (index, id) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + id,
      success: function (data) {
        posts.splice(index, 1);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

  // Add a Comment
  var addComment = function (newComment, index, id) {
    $.ajax({
      type: "POST",
      url: '/posts/' + id + '/comments',
      data: newComment,
      success: function (data) {
        posts[index] = data;
        _renderComments(index);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  // Delete a Comment
  var deleteComment = function (postIndex, postID, commentID) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + postID + '/comments/' + commentID,
      success: function (data) {
        posts[postIndex] = data;
        _renderComments(postIndex);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

  return {
    fetch: fetch,
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();

// Get all Posts and Comment Data on Page Load
app.fetch();


// Add a Post
$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");


// Delete a Post
$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();
  var id = $(this).closest('.post').data().id;
  app.removePost(index, id);
});

//Add a Comment
$posts.on('click', '.add-comment', function () {
  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var $post = $(this).closest('.post');
  var index = $post.index();
  var id = $post.data().id;

  var newComment = { text: $comment.val(), username: $user.val() };

  app.addComment(newComment, index, id);

  $comment.val("");
  $user.val("");
});

// Delete a Comment
$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var $post = $(this).closest('.post');
  var postIndex = $post.index();
  var postId = $post.data().id;
  var commentId = $(this).closest('.comment').data().id;

  app.deleteComment(postIndex, postId, commentId);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});