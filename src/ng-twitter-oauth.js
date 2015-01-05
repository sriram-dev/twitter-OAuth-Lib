/* 
 * ng- twitter-oauth
 * 
 * Created By - Sriram Desikan
 * 
 * 
 * DESCRIPTION:
 *
 * Angular module to access Twitter API for you applications using OAuth. 
 * Uses ng-cordova-oauth and oauth.js and simplifies the 2 step process to one.
 *
 *
 * REQUIRES - ng-cordova-oauth.js and jsOAuth.js files.
 *
 *
 */
(function(){

  angular.module("twitter-oauth", ['ngCordovaOauth']).
    factory("$twitterOAuth", function($cordovaOauth, $q) {
      var consumerKey = "none";
      var consumerSecret = "none";
      var oauth;
      return {
        init: function(consumer_key, consumer_secret) {          
          var options = {
            consumerKey: consumer_key,
            consumerSecret: consumer_secret
          };
          oauth = new OAuth(options);
          consumerKey = consumer_key;
          consumerSecret = consumer_secret;
        },

        connect: function() {
          var res_promise = $q.defer();
          $cordovaOauth.twitter(consumerKey, consumerSecret).then(function(data) {
            oauth.setAccessToken([data.oauth_token, data.oauth_token_secret]);
            res_promise.resolve(true);
            }, function(err) {
              res_promise.reject(err);
            }
          );
          return res_promise.promise;
        },

        call: function(url) {
          var res_promise = $q.defer();
          oauth.get(url, function(data) {
            res_promise.resolve(data);
          }, function(err) {
            res_promise.reject(err);
          });
          return res_promise.promise;
        }
      }
    });    
  }
)();