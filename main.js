const ProjectREADit = function () {
  let posts = [];
  // Initialize the selectedPost variables.
  let selectedPost = null;
  // Target the spcific post corresponding to the clicked button. No longer duplicates messages.
  const findSelectedItem = function (clickedButton) {
    const index = $(clickedButton)
      .closest(".post-content")
      .index();

    selectedPost = posts[index];
  };

  const createPost = function () {
    // Capture the input from the .user-name and textarea #new-post.
    const newPostUserName = $("#new-post-name").val();
    const newPostMessage = $("#new-post-message").val();
    // append the posts array with the new post obj, if there is content
    if (newPostUserName !== "" && newPostMessage !== "") {
      posts.push(
        {
          name: newPostUserName,
          message: newPostMessage,
          comments: []
        }
      );
    }
  };

  const deletePost = function () {
    if (confirm("Are you sure you want to permanently delete this entire post and its contents?")) {

      const index = (posts.indexOf(selectedPost));
      posts.splice(index, 1);
    };
  };

  const renderPosts = function () {
    $(".post-wrapper").empty();

    const newPostTemplate = Handlebars.compile($("#post-template").html());

    posts.forEach(function (post) {
      const renderedPost = newPostTemplate(post);
      $(".post-wrapper").append(renderedPost);
    });

    $("#new-post-name").val("");
    $("#new-post-message").val("");
  };

  const createComment = function () {
    // Capture input from the Bootstrap modal input fields
    const commenterName = $("#commenter-name").val();
    const commentText = $("#comment-text").val();
    // append to the related post, only if there is content
    if (commenterName !== "" && commentText !== "") {
      selectedPost
        .comments.push(
          {
            name: commenterName,
            comment: commentText
          }
        );
      $("#commenter-name").val("");
      $("#comment-text").val("");
      $("#comment-modal").modal("hide");
    }
  };

  const deleteComment = function (clickedButton) {
    if (confirm("Are you sure you want to permanently delete this comment?")) {
      const index = $(clickedButton).closest(".comment").index();

      selectedPost.comments.splice(index, 1);
    };
  };

  const renderComments = function () {
    $(".comment-container").empty();
    // Place into commentTemplate
    const commentTemplate = Handlebars.compile($("#comment-template").html());

    posts.forEach(function (post, index) {
      post.comments.forEach(function (comment) {
        const renderedComment = commentTemplate(comment);
        $(".post-wrapper")
          .find(".post-content")
          .eq(index)
          .find(".comment-container")
          .append(renderedComment);
      });
    });
  };

  const onHover = function () {
    $(this).css("color", "#DB3545");
  };

  const offHover = function () {
    $(this).css("color", "inherit");
  };

  const loadEventListeners = function () {
    // Add a click event listener to the submit button to create a post
    $(".new-post-button").click(function () {
      createPost();
      renderPosts();
      renderComments();
    });

    $(document).on("click", ".delete-post-button", function () {
      findSelectedItem(this);
      deletePost();
      renderPosts();
      renderComments();
    });
    // Click event listener for the leave comment buttons.
    $(document).on("click", ".leave-comment-button", function () {
      findSelectedItem(this);
    });
    // Add a click event listener to the modal submit button
    $("#add-comment-button").click(function () {
      createComment();
      renderPosts();
      renderComments();
    });

    $(document).on("click", ".delete-comment", function () {
      findSelectedItem(this);
      deleteComment(this);
      renderPosts();
      renderComments();
    });

    $(document).on("mouseenter", ".delete-comment i", onHover);

    $(document).on("mouseleave", ".delete-comment i", offHover);
  };

  return {
    start: loadEventListeners
  }
};

const app = ProjectREADit();

app.start();