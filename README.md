twitter-OAuth-Lib
=================

An angular module that can be used to make calls to Twitter API for applications using user-based authentication.

Uses
=====
[ng-cordova-oauth](https://github.com/nraboy/ng-cordova-oauth)

[jsOAuth](https://github.com/bytespider/jsOAuth)

Usage
======

The Module simplifies the two step process into a single step and helps make Twitter API Calls easier.

1. Include twitter-oauth-lib.js (from dist) in your html page(of ionic app). 

2. Include a dependent sha file [sha](https://github.com/Caligatio/jsSHA/tree/master/src)
 
3. Inject the module as dependency in your angular app. 
```javascript
angular.module("myapp", ["twitter-oauth"]);
/* Using in App with the factory */
angular.module("myapp").controller("SomeController", function($scope, $twitterOAuth) {

});
```


API
====

1. $twitterOAuth.init(consumer_key, consumer_secret) 

Use the consumerKey and consumerSecret from the app created in twitter.

2. $twitterOAuth.connect()

Returns a promise. 
Here ngCordovaOAuth is utilized and twitter authentication process is done. After successful completion oauth_token and oauth_token_secret will be received which will be utilized to make API Calls. 

3. $twitterOAuth.call(url) 

URL here is the actual twitter API call. It is recommended to use this once the promise is connect is resolved and within the sucess case. 

```javascript
angular.module("myapp").controller("SomeController", function($scope, $twitterOAuth) {
  $twitterOAuth.init(consumer_key, consumer_secret);
  $twitterOAuth.connect().then(function(data) {
    /* Make API calls here */
    var url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=<twitter_handle>&count=2"
    $twitterOAuth.call(url).then(function(data) {
      console.log(data);  
    }, function(err) {
    
    });
    
  }, function(err) {
  
  });
  
});
```
