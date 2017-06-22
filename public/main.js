var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  var fetch = function () {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        console.log(data);
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

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

  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: '/posts',
      data: newPost,
      success: function (data) {
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
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

  var removePost = function (id) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + id,
      success: function (data) {
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

  var addComment = function (newComment, id) {
    $.ajax({
      type: "POST",
      url: '/posts/' + id + '/comments',
      data: newComment,
      success: function (data) {
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var deleteComment = function (postID, commentID) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + postID + '/comments/' + commentID,
      success: function (data) {
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    fetch: fetch,
  };
};

var app = SpacebookApp();

app.fetch();

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

$posts.on('click', '.remove-post', function () {
  var id = $(this).closest('.post').data().id;
  app.removePost(id);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var id = $(this).closest('.post').data().id;

  var newComment = { text: $comment.val(), username: $user.val() };

  app.addComment(newComment, id);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postID = $(this).closest('.post').data().id;
  var commentID = $(this).closest('.comment').data().id;

  app.deleteComment(postID, commentID);
});
