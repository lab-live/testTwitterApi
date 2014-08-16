$(function(){
  $(document).ready(function(){
    function Twitter(){}

    Twitter.prototype = apiInfo;
    console.log(Twitter.prototype);

    Twitter.prototype.get = function(api, content){
      var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.tokenSecret
      };
      var message = {
        method: "GET",
        action: api,
        parameters: {
          oauth_version: "1.0",
          oauth_signature_method: "HMAC-SHA1",
          oauth_consumer_key: this.consumerKey,
          oauth_token: this.accessToken
        }
      };
      for (var key in content) {
        message.parameters[key] = content[key];
      }
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      var target = OAuth.addToURL(message.action, message.parameters);
      var options = {
        type: message.method,
        url: target,
        dataType: "jsonp",  //ここでjsonpを指定する
        jsonp: false,       //jQueryによるcallback関数名の埋め込みはしない
        cache: true         //リクエストパラメータに時刻を埋め込まない
      };
      $.ajax(options);
    }


    $('#button').click(function(e){
      var apiUrl  = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
      var twitter = new Twitter();
      var content = {count: 200, callback: "getStatus"};
      twitter.get(apiUrl, content);
    });
  });
});

function getStatus(data){
  var replies = 0;
  var expandedUrls = 0;
  var results = '';
  for(var i = 0; i < data.length; i++){
    if(data[i].in_reply_to_user_id != null){
      replies++;
    }
    console.log(data[i]);
    console.log(data[i].entities.urls);
    if(data[i].entities.urls.length > 0){
      expandedUrls++;
    }
    results += '<p>' + data[i].text + '</p>';
  }

  $('#result').append('<p>replies: '      + replies + '</p>' +
                      '<p>expandedUrls: ' + expandedUrls + '</p>' +
                      results);
}
