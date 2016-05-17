var sentiment = require('sentiment');
var request = require('request');

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

function report_status(access_token, owner, repo, sha, status, message) {
  // TODO report passing or failing status back to the PR
  response = {
    "state": status,
    "description": message,
    "context": "manners/golden-rule"
  }

  response_url = `https://api.github.com/v3/repos/${repo}/statuses/${sha}`;

  request.post(response_url, response);
}

exports.commentHandler = function(event, context, callback) {
  access_token = event.token;

  if (access_token == null){
    callback(null, "failure: Token is missing");
    return;
  }

  comment = JSON.parse(event);
  pull_request_creator = comment.pull_request.user.login;
  comment_body = comment.body;
  commenter = comment.user.login;
  pull_request_id = comment.pull_request.id;
  repo = comment.repository.full_name;
  sha = comment.pull_request.head.sha;

  if (positive_sentiment(pull_request_creator, comment_body)) {
    status_message = `Nobody has complimented ${pull_request_creator} yet.`;
    report_status(token, repo, sha, "failure", status_message);
  } else {
    status_message = `Hooray! ${commenter} said something nice about ${pull_request_creator}!`;
    report_status(token, repo, sha, "success", status_message);
  }

  callback(null, "success");
}
