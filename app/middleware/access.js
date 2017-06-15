module.exports = {
  canEditPost: function(req, post) {
    if (req.user && req.user.username && post && post.createdby) {
      return req.user.username.toLowerCase() == post.createdby.toLowerCase();
    }
    return false;
  }
}
