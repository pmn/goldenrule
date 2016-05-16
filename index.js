var sentiment = require('sentiment');
var Octokat = require('octokat');
var octo = new Octokat({token: process.env.GITHUB_ACCESS_TOKEN});

function positive_sentiment(author, comment){
  if (indexOf(author, comment) >= 0){
    comment_sentiment = sentiment(comment);
    if (comment_sentiment.score > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function report_status(repo, sha, status, message) {
  // TODO report passing or failing status back to the PR
}

exports.commentHandler = function(event, context, callback) {
  comment = JSON.parse(event);
  pull_request_creator = comment.pull_request.user.login;
  comment_body = comment.body;
  commenter = comment.user.login;
  pull_request_id = comment.pull_request.id;
  repo = comment.repository.full_name;
  sha = comment.pull_request.head.sha;
  if (positive_sentiment(pull_request_creator, comment_body)) {
    status_message = `Nobody has complimented ${pull_request_creator} yet.`;
    report_status(repo, sha, "failure", status_message);
  } else {
    status_message = `Hooray! ${commenter} said something nice about ${pull_request_creator}!`;
    report_status(repo, sha, "success", status_message);
  }

  callback(null, "success");
}
