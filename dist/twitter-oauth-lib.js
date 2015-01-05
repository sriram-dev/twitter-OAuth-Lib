/*
 * Cordova AngularJS Oauth
 *
 * Created by Nic Raboy
 * http://www.nraboy.com
 *
 *
 *
 * DESCRIPTION:
 *
 * Use Oauth sign in for various web services.
 *
 *
 * REQUIRES:
 *
 *    Apache Cordova 3.5+
 *    Apache InAppBrowser Plugin
 *
 *
 * SUPPORTS:
 *
 *    Dropbox
 *    Digital Ocean
 *    Google
 *    GitHub
 *    Facebook
 *    LinkedIn
 *    Instagram
 *    Box
 *    Reddit
 *    Twitter
 *    Meetup
 *    Salesforce
 *    Strava
 *    Withings
 *    Foursquare
 */

(function(){

    angular.module("ngCordovaOauth", ['ngCordovaOauthUtility']).factory('$cordovaOauth', ['$q', '$http', '$cordovaOauthUtility', function ($q, $http, $cordovaOauthUtility) {

        return {

            /*
             * Sign into the Dropbox service
             *
             * @param    string appKey
             * @return   promise
             */
            dropbox: function(appKey) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open("https://www.dropbox.com/1/oauth2/authorize?client_id=" + appKey + "&redirect_uri=http://localhost/callback" + "&response_type=token", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                        browserRef.addEventListener("loadstart", function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token, token_type: parameterMap.token_type, uid: parameterMap.uid });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Digital Ocean service
             *
             * @param    string clientId
             * @param    string clientSecret
             * @return   promise
             */
            digitalOcean: function(clientId, clientSecret) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open("https://cloud.digitalocean.com/v1/oauth/authorize?client_id=" + clientId + "&redirect_uri=http://localhost/callback&response_type=code&scope=read%20write", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                        browserRef.addEventListener("loadstart", function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http({method: "post", url: "https://cloud.digitalocean.com/v1/oauth/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                                    .success(function(data) {
                                        deferred.resolve(data);
                                    })
                                    .error(function(data, status) {
                                        deferred.reject("Problem authenticating");
                                    });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Google service
             *
             * @param    string clientId
             * @param    array appScope
             * @return   promise
             */
            google: function(clientId, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(" ") + '&approval_prompt=force&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener("loadstart", function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token, token_type: parameterMap.token_type, expires_in: parameterMap.expires_in });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the GitHub service
             *
             * @param    string clientId
             * @param    string clientSecret
             * @param    array appScope
             * @return   promise
             */
            github: function(clientId, clientSecret, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://github.com/login/oauth/authorize?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(","), '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http.defaults.headers.post.accept = 'application/json';
                                $http({method: "post", url: "https://github.com/login/oauth/access_token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&code=" + requestToken })
                                    .success(function(data) {
                                        deferred.resolve(data);
                                    })
                                    .error(function(data, status) {
                                        deferred.reject("Problem authenticating");
                                    });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Facebook service
             *
             * @param    string clientId
             * @param    array appScope
             * @return   promise
             */
            facebook: function(clientId, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://www.facebook.com/dialog/oauth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&response_type=token&scope=' + appScope.join(","), '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token, expires_in: parameterMap.expires_in });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the LinkedIn service
             *
             * @param    string clientId
             * @param    string clientSecret
             * @param    array appScope
             * @param    string state
             * @return   promise
             */
            linkedin: function(clientId, clientSecret, appScope, state) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://www.linkedin.com/uas/oauth2/authorization?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(" ") + '&response_type=code&state=' + state, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http({method: "post", url: "https://www.linkedin.com/uas/oauth2/accessToken", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                                    .success(function(data) {
                                        deferred.resolve(data);
                                    })
                                    .error(function(data, status) {
                                        deferred.reject("Problem authenticating");
                                    });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Instagram service
             *
             * @param    string clientId
             * @param    array appScope
             * @return   promise
             */
            instagram: function(clientId, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://api.instagram.com/oauth/authorize/?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(" ") + '&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Box service
             *
             * @param    string clientId
             * @param    string clientSecret
             * @param    string appState
             * @return   promise
             */
            box: function(clientId, clientSecret, appState) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://app.box.com/api/oauth2/authorize/?client_id=' + clientId + '&redirect_uri=http://localhost/callback&state=' + appState + '&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http({method: "post", url: "https://app.box.com/api/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                                    .success(function(data) {
                                        deferred.resolve(data);
                                    })
                                    .error(function(data, status) {
                                        deferred.reject("Problem authenticating");
                                    });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Reddit service
             *
             * @param    string clientId
             * @param    string clientSecret
             * @param    array appScope
             * @return   promise
             */
            reddit: function(clientId, clientSecret, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://ssl.reddit.com/api/v1/authorize?client_id=' + clientId + '&redirect_uri=http://localhost/callback&duration=permanent&state=ngcordovaoauth&scope=' + appScope.join(",") + '&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http.defaults.headers.post.Authorization = 'Basic ' + btoa(clientId + ":" + clientSecret);
                                $http({method: "post", url: "https://ssl.reddit.com/api/v1/access_token", data: "redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                                    .success(function(data) {
                                        deferred.resolve(data);
                                    })
                                    .error(function(data, status) {
                                        deferred.reject("Problem authenticating");
                                    });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Twitter service
             * Note that this service requires jsSHA for generating HMAC-SHA1 Oauth 1.0 signatures
             *
             * @param    string clientId
             * @param    string clientSecret
             * @return   promise
             */
            twitter: function(clientId, clientSecret) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        if(typeof jsSHA !== "undefined") {
                            var oauthObject = {
                                oauth_consumer_key: clientId,
                                oauth_nonce: $cordovaOauthUtility.createNonce(10),
                                oauth_signature_method: "HMAC-SHA1",
                                oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                                oauth_version: "1.0"
                            };
                            var signatureObj = $cordovaOauthUtility.createSignature("POST", "https://api.twitter.com/oauth/request_token", oauthObject,  { oauth_callback: "http://localhost.com/callback" }, clientSecret);
                            $http.defaults.headers.post.Authorization = signatureObj.authorization_header;
                            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                            $http({method: "post", url: "https://api.twitter.com/oauth/request_token", data: "oauth_callback=http://localhost.com/callback" })
                                .success(function(requestTokenResult) {
                                    var requestTokenParameters = (requestTokenResult).split("&");
                                    var parameterMap = {};
                                    for(var i = 0; i < requestTokenParameters.length; i++) {
                                        parameterMap[requestTokenParameters[i].split("=")[0]] = requestTokenParameters[i].split("=")[1];
                                    }
                                    if(parameterMap.hasOwnProperty("oauth_token") === false) {
                                        deferred.reject("Oauth request token was not received");
                                    }
                                    var browserRef = window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' + parameterMap.oauth_token, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                                    browserRef.addEventListener('loadstart', function(event) {
                                        if((event.url).indexOf("http://localhost.com/callback") === 0) {
                                            var callbackResponse = (event.url).split("?")[1];
                                            var responseParameters = (callbackResponse).split("&");
                                            var parameterMap = {};
                                            for(var i = 0; i < responseParameters.length; i++) {
                                                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                            }
                                            if(parameterMap.hasOwnProperty("oauth_verifier") === false) {
                                                deferred.reject("Browser authentication failed to complete.  No oauth_verifier was returned");
                                            }
                                            delete oauthObject.oauth_signature;
                                            oauthObject.oauth_token = parameterMap.oauth_token;
                                            var signatureObj = $cordovaOauthUtility.createSignature("POST", "https://api.twitter.com/oauth/access_token", oauthObject,  { oauth_verifier: parameterMap.oauth_verifier }, clientSecret);
                                            $http.defaults.headers.post.Authorization = signatureObj.authorization_header;
                                            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                            $http({method: "post", url: "https://api.twitter.com/oauth/access_token", data: "oauth_verifier=" + parameterMap.oauth_verifier })
                                                .success(function(result) {
                                                    var accessTokenParameters = result.split("&");
                                                    var parameterMap = {};
                                                    for(var i = 0; i < accessTokenParameters.length; i++) {
                                                        parameterMap[accessTokenParameters[i].split("=")[0]] = accessTokenParameters[i].split("=")[1];
                                                    }
                                                    if(parameterMap.hasOwnProperty("oauth_token_secret") === false) {
                                                        deferred.reject("Oauth access token was not received");
                                                    }                                                    
                                                    deferred.resolve(parameterMap);
                                                    browserRef.close();
                                                })
                                                .error(function(error) {
                                                    deferred.reject(error);
                                                    browserRef.close();
                                                });                                                                    
                                        }
                                    });
                                    browserRef.addEventListener('exit', function(event) {
                                        deferred.reject("The sign in flow was canceled" + JSON.stringify(event));
                                    });
                                })
                                .error(function(error) {
                                    deferred.reject(error);
                                });
                        } else {
                            deferred.reject("Missing jsSHA JavaScript library");
                        }
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
            * Sign into the Meetup service
            *
            * @param    string clientId
            * @return   promise
            */
            meetup: function(clientId) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://secure.meetup.com/oauth2/authorize/?client_id=' + clientId + '&redirect_uri=http://localhost/callback&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = {};
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve(parameterMap);
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Salesforce service
             *
             * Suggestion: use salesforce oauth with forcetk.js(as SDK)
             *
             * @param    string loginUrl (such as: https://login.salesforce.com ; please notice community login)
             * @param    string clientId (copy from connection app info)
             * @param    string redirectUri (callback url in connection app info)
             * @return   promise
             */
            salesforce: function (loginUrl, clientId) {
                var redirectUri = 'http://localhost/callback';
                var getAuthorizeUrl = function (loginUrl, clientId, redirectUri) {
                    return loginUrl+'services/oauth2/authorize?display=touch'+
                        '&response_type=token&client_id='+escape(clientId)+
                        '&redirect_uri='+escape(redirectUri);
                };
                var startWith = function(string, str) {
                    return (string.substr(0, str.length) === str);
                };
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open(getAuthorizeUrl(loginUrl, clientId, redirectUri), "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                        browserRef.addEventListener("loadstart", function(event) {
                            if(startWith(event.url, redirectUri)) {
                                var oauthResponse = {};

                                var fragment = (event.url).split('#')[1];

                                if (fragment) {
                                    var nvps = fragment.split('&');
                                    for (var nvp in nvps) {
                                          var parts = nvps[nvp].split('=');
                                          oauthResponse[parts[0]] = unescape(parts[1]);
                                    }
                                }

                                if (typeof oauthResponse === 'undefined' ||
                                    typeof oauthResponse.access_token === 'undefined') {
                                    deferred.reject("Problem authenticating");
                                } else {
                                    deferred.resolve(oauthResponse);
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
            * Sign into the Strava service
            *
            * @param    string clientId
            * @param    string clientSecret
            * @param    array appScope
            * @return   promise
            */
            strava: function(clientId, clientSecret, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(",") + '&response_type=code&approval_prompt=force', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function(event) {
                            if((event.url).indexOf("http://localhost/callback") === 0) {
                                requestToken = (event.url).split("code=")[1];
                                $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                                $http({method: "post", url: "https://www.strava.com/oauth/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&code=" + requestToken })
                                .success(function(data) {
                                    deferred.resolve(data);
                                })
                                .error(function(data, status) {
                                    deferred.reject("Problem authenticating");
                                });
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
             * Sign into the Withings service
             * Note that this service requires jsSHA for generating HMAC-SHA1 Oauth 1.0 signatures
             *
             * @param    string clientId
             * @param    string clientSecret
             * @return   promise
             */
            withings: function(clientId, clientSecret) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        if(typeof jsSHA !== "undefined") {

                            // Step 1 : get a oAuth "request token"
                            var oauthObject = $cordovaOauthUtility.generateOauthParametersInstance(clientId);
                            oauthObject.oauth_callback = 'http://localhost/callback';

                            var requestTokenUrlBase = "https://oauth.withings.com/account/request_token";
                            var signatureObj = $cordovaOauthUtility.createSignature("GET", requestTokenUrlBase, {}, oauthObject, clientSecret);
                            oauthObject.oauth_signature = signatureObj.signature;

                            var requestTokenParameters = $cordovaOauthUtility.generateUrlParameters(oauthObject);

                            $http({method: "get", url: requestTokenUrlBase + "?" + requestTokenParameters })
                                .success(function(requestTokenResult) {

                                    // Step 2 : End-user authorization
                                    var parameterMap = $cordovaOauthUtility.parseResponseParameters(requestTokenResult);
                                    if(parameterMap.hasOwnProperty("oauth_token") === false) {
                                        deferred.reject("Oauth request token was not received");
                                    }
                                    var oauthObject = $cordovaOauthUtility.generateOauthParametersInstance(clientId);
                                    oauthObject.oauth_token = parameterMap.oauth_token;

                                    // used in step 3
                                    var oauthTokenSecret = parameterMap.oauth_token_secret;

                                    var authorizeUrlBase = "https://oauth.withings.com/account/authorize";
                                    var signatureObj = $cordovaOauthUtility.createSignature("GET", authorizeUrlBase, {}, oauthObject, clientSecret);
                                    oauthObject.oauth_signature = signatureObj.signature;

                                    var authorizeParameters = $cordovaOauthUtility.generateUrlParameters(oauthObject);
                                    var browserRef = window.open(authorizeUrlBase + '?' + authorizeParameters, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

                                    // STEP 3: User Data Access token
                                    browserRef.addEventListener('loadstart', function(event) {
                                        if((event.url).indexOf("http://localhost/callback") === 0) {
                                            var callbackResponse = (event.url).split("?")[1];
                                            parameterMap = $cordovaOauthUtility.parseResponseParameters(callbackResponse);
                                            if(parameterMap.hasOwnProperty("oauth_verifier") === false) {
                                                deferred.reject("Browser authentication failed to complete.  No oauth_verifier was returned");
                                            }

                                            var oauthObject = $cordovaOauthUtility.generateOauthParametersInstance(clientId);
                                            oauthObject.oauth_token = parameterMap.oauth_token;

                                            var accessTokenUrlBase = "https://oauth.withings.com/account/access_token";
                                            var signatureObj = $cordovaOauthUtility.createSignature("GET", accessTokenUrlBase, {}, oauthObject, clientSecret, oauthTokenSecret);
                                            oauthObject.oauth_signature = signatureObj.signature;

                                            var accessTokenParameters = $cordovaOauthUtility.generateUrlParameters(oauthObject);

                                            $http({method: "get", url: accessTokenUrlBase + '?' + accessTokenParameters})
                                                .success(function(result) {
                                                    var parameterMap = $cordovaOauthUtility.parseResponseParameters(result);
                                                    if(parameterMap.hasOwnProperty("oauth_token_secret") === false) {
                                                        deferred.reject("Oauth access token was not received");
                                                    }
                                                    deferred.resolve(parameterMap);
                                                })
                                                .error(function(error) {
                                                    deferred.reject(error);
                                                });
                                            browserRef.close();
                                        }
                                    });
                                    browserRef.addEventListener('exit', function(event) {
                                        deferred.reject("The sign in flow was canceled");
                                    });
                                })
                                .error(function(error) {
                                    deferred.reject(error);
                                });
                        } else {
                            deferred.reject("Missing jsSHA JavaScript library");
                        }
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },

            /*
            * Sign into the Foursquare service
            *
            * @param    string clientId
            * @return   promise
            */
            foursquare: function(clientId) {
                var deferred = $q.defer();
                if (window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if (cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {
                        var browserRef = window.open('https://foursquare.com/oauth2/authenticate?client_id=' + clientId + '&redirect_uri=http://localhost/callback&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                        browserRef.addEventListener('loadstart', function (event) {
                            if ((event.url).indexOf("http://localhost/callback") === 0) {
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for (var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if (parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    var promiseResponse = {
                                        access_token: parameterMap.access_token,
                                        expires_in: parameterMap.expires_in
                                    };
                                    deferred.resolve(promiseResponse);
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                                browserRef.close();
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            }

        };

    }]);


    /*
     * The purpose of ngCordovaOauthUtility is to act as a utility factory for assisting in
     * authentication to various services.  For example, Twitter requires request signing, so
     * a signature utility was added
     */
    angular.module("ngCordovaOauthUtility", []).factory('$cordovaOauthUtility', ['$q', function ($q) {

        return {

            /*
             * Sign an Oauth 1.0 request
             *
             * @param    string method
             * @param    string endPoint
             * @param    object headerParameters
             * @param    object bodyParameters
             * @param    string secretKey
             * @param    string tokenSecret (optional)
             * @return   object
             */
            createSignature: function(method, endPoint, headerParameters, bodyParameters, secretKey, tokenSecret) {
                if(typeof jsSHA !== "undefined") {
                    var headerAndBodyParameters = angular.copy(headerParameters);
                    var bodyParameterKeys = Object.keys(bodyParameters);
                    for(var i = 0; i < bodyParameterKeys.length; i++) {
                        headerAndBodyParameters[bodyParameterKeys[i]] = encodeURIComponent(bodyParameters[bodyParameterKeys[i]]);
                    }
                    var signatureBaseString = method + "&" + encodeURIComponent(endPoint) + "&";
                    var headerAndBodyParameterKeys = (Object.keys(headerAndBodyParameters)).sort();
                    for(i = 0; i < headerAndBodyParameterKeys.length; i++) {
                        if(i == headerAndBodyParameterKeys.length - 1) {
                            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]]);
                        } else {
                            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]] + "&");
                        }
                    }
                    var oauthSignatureObject = new jsSHA(signatureBaseString, "TEXT");

                    var encodedTokenSecret = '';
                    if (tokenSecret) {
                        encodedTokenSecret = encodeURIComponent(tokenSecret);
                    }

                    headerParameters.oauth_signature = encodeURIComponent(oauthSignatureObject.getHMAC(encodeURIComponent(secretKey) + "&" + encodedTokenSecret, "TEXT", "SHA-1", "B64"));
                    var headerParameterKeys = Object.keys(headerParameters);
                    var authorizationHeader = 'OAuth ';
                    for(i = 0; i < headerParameterKeys.length; i++) {
                        if(i == headerParameterKeys.length - 1) {
                            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '"';
                        } else {
                            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '",';
                        }
                    }
                    return { signature_base_string: signatureBaseString, authorization_header: authorizationHeader, signature: headerParameters.oauth_signature };
                } else {
                    return "Missing jsSHA JavaScript library";
                }
            },

            /*
            * Create Random String Nonce
            *
            * @param    integer length
            * @return   string
            */
            createNonce: function(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            },

            generateUrlParameters: function (parameters) {
                var sortedKeys = Object.keys(parameters);
                sortedKeys.sort();

                var params = "";
                var amp = "";

                for (var i = 0 ; i < sortedKeys.length; i++) {
                    params += amp + sortedKeys[i] + "=" + parameters[sortedKeys[i]];
                    amp = "&";
                }

                return params;
            },

            parseResponseParameters: function (response) {
                if (response.split) {
                    var parameters = response.split("&");
                    var parameterMap = {};
                    for(var i = 0; i < parameters.length; i++) {
                        parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
                    }
                    return parameterMap;
                }
                else {
                    return {};
                }
            },

            generateOauthParametersInstance: function(consumerKey) {
                var nonceObj = new jsSHA(Math.round((new Date()).getTime() / 1000.0), "TEXT");
                var oauthObject = {
                    oauth_consumer_key: consumerKey,
                    oauth_nonce: nonceObj.getHash("SHA-1", "HEX"),
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                    oauth_version: "1.0"
                };
                return oauthObject;
            }
        };

    }]);

})();;/**
 *  @license
 *  jsOAuth version 1.3.7
 *  Copyright (c) 2010, 2011 Rob Griffiths (http://bytespider.eu)
 *  jsOAuth is freely distributable under the terms of an MIT-style license.
 */

var exports = exports || this;
exports.OAuth = (function (global) {

    /** signed.applets.codebase_principal_support to enable support in Firefox **/

    function Collection(obj) {
        var args = arguments, args_callee = args.callee, args_length = args.length,
            i, collection = this;

        if (!(this instanceof args_callee)) {
            return new args_callee(obj);
        }

        for(i in obj) {
            if (obj.hasOwnProperty(i)) {
                collection[i] = obj[i];
            }
        }

        return collection;
    }

    function Hash() {}
    Hash.prototype = {
        join: function(string){
            string = string || '';
            return this.values().join(string);
        },
        keys: function(){
            var i, arr = [], self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    arr.push(i);
                }
            }

            return arr;
        },
        values: function(){
            var i, arr = [], self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    arr.push(self[i]);
                }
            }

            return arr;
        },
        shift: function(){throw 'not implimented';},
        unshift: function(){throw 'not implimented';},
        push: function(){throw 'not implimented';},
        pop: function(){throw 'not implimented';},
        sort: function(){throw 'not implimented';},

        ksort: function(func){
            var self = this, keys = self.keys(), i, value, key;

            if (func == undefined) {
                keys.sort();
            } else {
                keys.sort(func);
            }

            for (i = 0; i  < keys.length; i++) {
                key = keys[i];
                value = self[key];
                delete self[key];
                self[key] = value;
            }

            return self;
        },
        toObject: function () {
            var obj = {}, i, self = this;
            for (i in self) {
                if (self.hasOwnProperty(i)) {
                    obj[i] = self[i];
                }
            }

            return obj;
        }
    };
    Collection.prototype = new Hash;
    /**
     * Url
     *
     * @constructor
     * @param {String} url
     */
    function URI(url) {
        var args = arguments, args_callee = args.callee,
            parsed_uri, scheme, host, port, path, query, anchor,
            parser = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/,
            uri = this;

        if (!(this instanceof args_callee)) {
            return new args_callee(url);
        }

        uri.scheme = '';
        uri.host = '';
        uri.port = '';
        uri.path = '';
        uri.query = new QueryString();
        uri.anchor = '';

        if (url !== null) {
            parsed_uri = url.match(parser);

            scheme = parsed_uri[1];
            host = parsed_uri[2];
            port = parsed_uri[3];
            path = parsed_uri[4];
            query = parsed_uri[5];
            anchor = parsed_uri[6];

            scheme = (scheme !== undefined) ? scheme.replace('://', '').toLowerCase() : 'http';
            port = (port ? port.replace(':', '') : (scheme === 'https' ? '443' : '80'));
            // correct the scheme based on port number
            scheme = (scheme == 'http' && port === '443' ? 'https' : scheme);
            query = query ? query.replace('?', '') : '';
            anchor = anchor ? anchor.replace('#', '') : '';


            // Fix the host name to include port if non-standard ports were given
            if ((scheme === 'https' && port !== '443') || (scheme === 'http' && port !== '80')) {
                host = host + ':' + port;
            }

            uri.scheme = scheme;
            uri.host = host;
            uri.port = port;
            uri.path = path || '/';
            uri.query.setQueryParams(query);
            uri.anchor = anchor || '';
        }
    }

    URI.prototype = {
        scheme: '',
        host: '',
        port: '',
        path: '',
        query: '',
        anchor: '',
        toString: function () {
            var self = this, query = self.query + '';
            return self.scheme + '://' + self.host + self.path + (query != '' ? '?' + query : '') + (self.anchor !== '' ? '#' + self.anchor : '');
        }
    };

    /**
     * Create and manage a query string
     *
     * @param {Object} obj
     */
    function QueryString(obj){
        var args = arguments, args_callee = args.callee, args_length = args.length,
            i, querystring = this, decode = OAuth.urlDecode;

        if (!(this instanceof args_callee)) {
            return new args_callee(obj);
        }

        if (obj != undefined) {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    querystring[i] = obj[i];
                }
            }
        }

        return querystring;
    }
    // QueryString is a type of collection So inherit
    QueryString.prototype = new Collection();

    QueryString.prototype.toString = function () {
        var i, self = this, q_arr = [], ret = '',
        val = '', encode = OAuth.urlEncode;
        self.ksort(); // lexicographical byte value ordering of the keys

        for (i in self) {
            if (self.hasOwnProperty(i)) {
                if (i != undefined && self[i] != undefined) {
                    val = encode(i) + '=' + encode(self[i]);
                    q_arr.push(val);
                }
            }
        }

        if (q_arr.length > 0) {
            ret = q_arr.join('&');
        }

        return ret;
    };

    /**
     *
     * @param {Object} query
     */
    QueryString.prototype.setQueryParams = function (query) {
        var args = arguments, args_length = args.length, i, query_array,
            query_array_length, querystring = this, key_value, decode = OAuth.urlDecode;

        if (args_length == 1) {
            if (typeof query === 'object') {
                // iterate
                for (i in query) {
                    if (query.hasOwnProperty(i)) {
                        querystring[i] = decode(query[i]);
                    }
                }
            } else if (typeof query === 'string') {
                // split string on '&'
                query_array = query.split('&');
                // iterate over each of the array items
                for (i = 0, query_array_length = query_array.length; i < query_array_length; i++) {
                    // split on '=' to get key, value
                    key_value = query_array[i].split('=');
                    if (key_value[0] != "") {
                        querystring[key_value[0]] = decode(key_value[1]);
                    }
                }
            }
        } else {
            for (i = 0; i < args_length; i += 2) {
                // treat each arg as key, then value
                querystring[args[i]] = decode(args[i+1]);
            }
        }
    };

    /** @const */ var OAUTH_VERSION_1_0 = '1.0';

    /**
     * OAuth
     *
     * @constructor
     */
    function OAuth(options) {
        if (!(this instanceof OAuth)) {
            return new OAuth(options);
        }

        return this.init(options);
    }

    OAuth.prototype = {
        realm: '',
        requestTokenUrl: '',
        authorizationUrl: '',
        accessTokenUrl: '',

        init: function (options) {
            var empty = '';
            var oauth = {
                enablePrivilege: options.enablePrivilege || false,

                proxyUrl: options.proxyUrl,
                callbackUrl: options.callbackUrl || 'oob',

                consumerKey: options.consumerKey,
                consumerSecret: options.consumerSecret,
                accessTokenKey: options.accessTokenKey || empty,
                accessTokenSecret: options.accessTokenSecret || empty,
                verifier: empty,
                signatureMethod: options.signatureMethod || 'HMAC-SHA1'
            };

            this.realm = options.realm || empty;
            this.requestTokenUrl = options.requestTokenUrl || empty;
            this.authorizationUrl = options.authorizationUrl || empty;
            this.accessTokenUrl = options.accessTokenUrl || empty;

            this.getAccessToken = function () {
                return [oauth.accessTokenKey, oauth.accessTokenSecret];
            };

            this.getAccessTokenKey = function () {
                return oauth.accessTokenKey;
            };

            this.getAccessTokenSecret = function () {
                return oauth.accessTokenSecret;
            };

            this.setAccessToken = function (tokenArray, tokenSecret) {
                if (tokenSecret) {
                    tokenArray = [tokenArray, tokenSecret];
                }
                oauth.accessTokenKey = tokenArray[0];
                oauth.accessTokenSecret = tokenArray[1];
            };

            this.getVerifier = function () {
                return oauth.verifier;
            };

            this.setVerifier = function (verifier) {
                oauth.verifier = verifier;
            };

            this.setCallbackUrl = function (url) {
                oauth.callbackUrl = url;
            };

            /**
             * Makes an authenticated http request
             *
             * @param options {object}
             *      method {string} ['GET', 'POST', 'PUT', ...]
             *      url {string} A valid http(s) url
             *      data {object} A key value paired object of data
             *                      example: {'q':'foobar'}
             *                      for GET this will append a query string
             *      headers {object} A key value paired object of additional headers
             *      success {function} callback for a sucessful request
             *      failure {function} callback for a failed request
             */
            this.request = function (options) {
                var method, url, data, headers, success, failure, xhr, i,
                    headerParams, signatureMethod, signatureString, signature,
                    query = [], appendQueryString, signatureData = {}, params, withFile, urlString;

                method = options.method || 'GET';
                url = URI(options.url);
                data = options.data || {};
                headers = options.headers || {};
                success = options.success || function () {};
                failure = options.failure || function () {};

                // According to the spec
                withFile = (function(){
                    var hasFile = false;
                    for(var name in data) {
                        // Thanks to the FileAPI any file entry
                        // has a fileName property
                        if(data[name] instanceof  File || typeof data[name].fileName != 'undefined') hasFile = true;
                    }

                    return hasFile;
                })();

                appendQueryString = options.appendQueryString ? options.appendQueryString : false;

                if (oauth.enablePrivilege) {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead UniversalBrowserWrite');
                }

                xhr = Request();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        var regex = /^(.*?):\s*(.*?)\r?$/mg,
                            requestHeaders = headers,
                            responseHeaders = {},
                            responseHeadersString = '',
                            match;

                        if (!!xhr.getAllResponseHeaders) {
                            responseHeadersString = xhr.getAllResponseHeaders();
                            while((match = regex.exec(responseHeadersString))) {
                                responseHeaders[match[1]] = match[2];
                            }
                        } else if(!!xhr.getResponseHeaders) {
                            responseHeadersString = xhr.getResponseHeaders();
                            for (var i = 0, len = responseHeadersString.length; i < len; ++i) {
                                responseHeaders[responseHeadersString[i][0]] = responseHeadersString[i][1];
                            }
                        }

                        var includeXML = false;
                        if ('Content-Type' in responseHeaders)
                        {
                            if (responseHeaders['Content-Type'] == 'text/xml')
                            {
                                includeXML = true;
                            }

                        }
                        var responseObject = {text: xhr.responseText, xml: (includeXML ? xhr.responseXML : ''), requestHeaders: requestHeaders, responseHeaders: responseHeaders};

                        // we are powerless against 3xx redirects
                        if((xhr.status >= 200 && xhr.status <= 226) || xhr.status == 304 || xhr.status === 0) {
                            success(responseObject);
                        // everything what is 400 and above is a failure code
                        } else if(xhr.status >= 400 && xhr.status !== 0) {
                            failure(responseObject);
                        }
                    }
                };

                headerParams = {
                    'oauth_callback': oauth.callbackUrl,
                    'oauth_consumer_key': oauth.consumerKey,
                    'oauth_token': oauth.accessTokenKey,
                    'oauth_signature_method': oauth.signatureMethod,
                    'oauth_timestamp': getTimestamp(),
                    'oauth_nonce': getNonce(),
                    'oauth_verifier': oauth.verifier,
                    'oauth_version': OAUTH_VERSION_1_0
                };

                signatureMethod = oauth.signatureMethod;

                // Handle GET params first
                params = url.query.toObject();
                for (i in params) {
                    signatureData[i] = params[i];
                }

                // According to the OAuth spec
                // if data is transfered using
                // multipart the POST data doesn't
                // have to be signed:
                // http://www.mail-archive.com/oauth@googlegroups.com/msg01556.html
                if((!('Content-Type' in headers) || headers['Content-Type'] == 'application/x-www-form-urlencoded') && !withFile) {
                    for (i in data) {
                        signatureData[i] = data[i];
                    }
                }

                urlString = url.scheme + '://' + url.host + url.path;
                signatureString = toSignatureBaseString(method, urlString, headerParams, signatureData);

                signature = OAuth.signatureMethod[signatureMethod](oauth.consumerSecret, oauth.accessTokenSecret, signatureString);

                headerParams.oauth_signature = signature;

                if (this.realm)
                {
                    headerParams['realm'] = this.realm;
                }

                if (oauth.proxyUrl) {
                    url = URI(oauth.proxyUrl + url.path);
                }

                if(appendQueryString || method == 'GET') {
                    url.query.setQueryParams(data);
                    query = null;
                } else if(!withFile){
                    if (typeof data == 'string') {
                        query = data;
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'text/plain';
                        }
                    } else {
                        for(i in data) {
                            query.push(OAuth.urlEncode(i) + '=' + OAuth.urlEncode(data[i] + ''));
                        }
                        query = query.sort().join('&');
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'application/x-www-form-urlencoded';
                        }
                    }

                } else if(withFile) {
                    // When using FormData multipart content type
                    // is used by default and required header
                    // is set to multipart/form-data etc
                    query = new FormData();
                    for(i in data) {
                        query.append(i, data[i]);
                    }
                }

                xhr.open(method, url+'', true);

                xhr.setRequestHeader('Authorization', 'OAuth ' + toHeaderString(headerParams));
                xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
                for (i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                xhr.send(query);
            };

            return this;
        },

        /**
         * Wrapper for GET OAuth.request
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        get: function (url, success, failure) {
            this.request({'url': url, 'success': success, 'failure': failure});
        },

        /**
         * Wrapper for POST OAuth.request
         *
         * @param url {string} vaild http(s) url
         * @param data {object} A key value paired object of data
         *                      example: {'q':'foobar'}
         *                      for GET this will append a query string
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        post: function (url, data, success, failure) {
            this.request({'method': 'POST', 'url': url, 'data': data, 'success': success, 'failure': failure});
        },

        /**
         * Wrapper to parse a JSON string and pass it to the callback
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        getJSON: function (url, success, failure) {
            this.get(url, function (data) {
                success(JSON.parse(data.text));
            }, failure);
        },

        /**
         * Wrapper to parse a JSON string and pass it to the callback
         *
         * @param url {string} vaild http(s) url
         * @param success {function} callback for a successful request
         * @param failure {function} callback for a failed request
         */
        postJSON: function (url, data, success, failure) {
            this.request({
                'method': 'POST',
                'url': url,
                'data': JSON.stringify(data),
                'success': function (data) {
                    success(JSON.parse(data.text));
                },
                'failure': failure,
                'headers': {
                    'Content-Type': 'application/json'
                }
            });
        },

        parseTokenRequest: function (tokenRequest, content_type) {

            switch(content_type)
            {
                case "text/xml":
                    var token = tokenRequest.xml.getElementsByTagName('token');
                    var secret = tokenRequest.xml.getElementsByTagName('secret');

                    obj[OAuth.urlDecode(token[0])] = OAuth.urlDecode(secret[0]);
                    break;

                default:
                    var i = 0, arr = tokenRequest.text.split('&'), len = arr.length, obj = {};
                    for (; i < len; ++i) {
                        var pair = arr[i].split('=');
                        obj[OAuth.urlDecode(pair[0])] = OAuth.urlDecode(pair[1]);
                    }
            }


            return obj;
        },

        fetchRequestToken: function (success, failure) {
            var oauth = this;
            oauth.setAccessToken('', '');

            var url = oauth.authorizationUrl;
            this.get(this.requestTokenUrl, function (data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders['Content-Type'] || undefined);
                oauth.setAccessToken([token.oauth_token, token.oauth_token_secret]);
                success(url + '?' + data.text);
            }, failure);
        },

        fetchAccessToken: function (success, failure) {
            var oauth = this;
            this.get(this.accessTokenUrl, function (data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders['Content-Type'] || undefined);
                oauth.setAccessToken([token.oauth_token, token.oauth_token_secret]);

                // clean up a few un-needed things
                oauth.setVerifier('');

                success(data);
            }, failure);
        }
    };

    OAuth.signatureMethod = {
        /**
         * Sign the request
         *
         * @param consumer_secret {string} the consumer secret
         * @param token_secret {string}  the token secret
         * @param signature_base {string}  the signature base string
         */
        'HMAC-SHA1': function (consumer_secret, token_secret, signature_base) {
            var passphrase, signature, encode = OAuth.urlEncode;

            consumer_secret = encode(consumer_secret);
            token_secret = encode(token_secret || '');

            passphrase = consumer_secret + '&' + token_secret;
            signature = HMAC(SHA1.prototype, passphrase, signature_base);

            return global.btoa(signature);
        }
    };

    /**
     * Get a string of the parameters for the OAuth Authorization header
     *
     * @param params {object} A key value paired object of data
     *                           example: {'q':'foobar'}
     *                           for GET this will append a query string
     */
    function toHeaderString(params) {
        var arr = [], i, realm;

        for (i in params) {
            if (params[i] && params[i] !== undefined && params[i] !== '') {
                if (i === 'realm') {
                    realm = i + '="' + params[i] + '"';
                } else {
                    arr.push(i + '="' + OAuth.urlEncode(params[i]+'') + '"');
                }
            }
        }

        arr.sort();
        if (realm) {
            arr.unshift(realm);
        }

        return arr.join(', ');
    }

    /**
     * Generate a signature base string for the request
     *
     * @param method {string} ['GET', 'POST', 'PUT', ...]
     * @param url {string} A valid http(s) url
     * @param header_params A key value paired object of additional headers
     * @param query_params {object} A key value paired object of data
     *                               example: {'q':'foobar'}
     *                               for GET this will append a query string
     */
    function toSignatureBaseString(method, url, header_params, query_params) {
        var arr = [], i, encode = OAuth.urlEncode;

        for (i in header_params) {
            if (header_params[i] !== undefined && header_params[i] !== '') {
                arr.push([OAuth.urlEncode(i), OAuth.urlEncode(header_params[i]+'')]);
            }
        }

        for (i in query_params) {
            if (query_params[i] !== undefined && query_params[i] !== '') {
                if (!header_params[i]) {
                    arr.push([encode(i), encode(query_params[i] + '')]);
                }
            }
        }

        arr = arr.sort(function(a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            if (a[1] < b[1]) {
              return -1;
            } else if (a[1] > b[1]) {
              return 1;
            } else {
              return 0;
            }
          }
        }).map(function(el) {
          return el.join("=");
        });

        return [
            method,
            encode(url),
            encode(arr.join('&'))
        ].join('&');
    }

    /**
     * Generate a timestamp for the request
     */
    function getTimestamp() {
        return parseInt(+new Date() / 1000, 10); // use short form of getting a timestamp
    }

    /**
     * Generate a nonce for the request
     *
     * @param key_length {number} Optional nonce length
     */
    function getNonce(key_length) {
        function rand() {
            return Math.floor(Math.random() * chars.length);
        }

        key_length = key_length || 64;

        var key_bytes = key_length / 8, value = '', key_iter = key_bytes / 4,
        key_remainder = key_bytes % 4, i,
        chars = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                     '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33',
                     '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D',
                     '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47',
                     '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51',
                     '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B',
                     '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65',
                     '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F',
                     '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
                     '7A', '7B', '7C', '7D', '7E'];

        for (i = 0; i < key_iter; i++) {
            value += chars[rand()] + chars[rand()] + chars[rand()]+ chars[rand()];
        }

        // handle remaing bytes
        for (i = 0; i < key_remainder; i++) {
            value += chars[rand()];
        }

        return value;
    }

    /**
     * rfc3986 compatable encode of a string
     *
     * @param {String} string
     */
    OAuth.urlEncode = function (string) {
        function hex(code) {
            var hex = code.toString(16).toUpperCase();
            if (hex.length < 2) {
                hex = 0 + hex;
            }
            return '%' + hex;
        }

        if (!string) {
            return '';
        }

        string = string + '';
        var reserved_chars = /[ \t\r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/,
            str_len = string.length, i, string_arr = string.split(''), c;

        for (i = 0; i < str_len; i++) {
            if (c = string_arr[i].match(reserved_chars)) {
                c = c[0].charCodeAt(0);

                if (c < 128) {
                    string_arr[i] = hex(c);
                } else if (c < 2048) {
                    string_arr[i] = hex(192+(c>>6)) + hex(128+(c&63));
                } else if (c < 65536) {
                    string_arr[i] = hex(224+(c>>12)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
                } else if (c < 2097152) {
                    string_arr[i] = hex(240+(c>>18)) + hex(128+((c>>12)&63)) + hex(128+((c>>6)&63)) + hex(128+(c&63));
                }
            }
        }

        return string_arr.join('');
    };

    /**
     * rfc3986 compatable decode of a string
     *
     * @param {String} string
     */
    OAuth.urlDecode = function (string){
        if (!string) {
            return '';
        }

        return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
            return String.fromCharCode(parseInt(match.replace('%', ''), 16));
        });
    };
    /**
     * Factory object for XMLHttpRequest
     */
    function Request() {
        var XHR;


        if (typeof global.Titanium !== 'undefined' && typeof global.Titanium.Network.createHTTPClient != 'undefined') {
            XHR = global.Titanium.Network.createHTTPClient();
        } else if (typeof require !== 'undefined') {
            // CommonJS require
            try {
                XHR = new require("xhr").XMLHttpRequest();
            } catch (e) {
                // module didn't expose correct API or doesn't exists
                if (typeof global.XMLHttpRequest !== "undefined") {
                    XHR = new global.XMLHttpRequest();
                } else {
                    throw "No valid request transport found.";
                }
            }
        } else if (typeof global.XMLHttpRequest !== "undefined") {
            // W3C
            XHR = new global.XMLHttpRequest();
        } else {
            throw "No valid request transport found.";
        }

        return XHR;
    }
    function zeroPad(length) {
        var arr = new Array(++length);
        return arr.join(0).split('');
    }

    function stringToByteArray(str) {
        var bytes = [], code, i;

        for(i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);

            if (code < 128) {
                bytes.push(code);
            } else if (code < 2048) {
                bytes.push(192+(code>>6), 128+(code&63));
            } else if (code < 65536) {
                bytes.push(224+(code>>12), 128+((code>>6)&63), 128+(code&63));
            } else if (code < 2097152) {
                bytes.push(240+(code>>18), 128+((code>>12)&63), 128+((code>>6)&63), 128+(code&63));
            }
        }

        return bytes;
    }

    function wordsToByteArray(words) {
        var bytes = [], i;
        for (i = 0; i < words.length * 32; i += 8) {
            bytes.push((words[i >>> 5] >>> (24 - i % 32)) & 255);
        }
        return bytes;
    }

    function byteArrayToHex(byteArray) {
        var hex = [], l = byteArray.length, i;
        for (i = 0; i < l; i++) {
            hex.push((byteArray[i] >>> 4).toString(16));
            hex.push((byteArray[i] & 0xF).toString(16));
        }
        return hex.join('');
    }

    function byteArrayToString(byteArray) {
        var string = '', l = byteArray.length, i;
        for (i = 0; i < l; i++) {
            string += String.fromCharCode(byteArray[i]);
        }
        return string;
    }

    function leftrotate(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }

    function SHA1(message) {
        if (message !== undefined) {
            var m = message, crypto, digest;
            if (m.constructor === String) {
                m = stringToByteArray(m);
            }

            if (!(this instanceof SHA1)) {
                crypto =  new SHA1(message);
            } else {
                crypto = this;
            }
            digest = crypto.hash(m);

            return byteArrayToHex(digest);
        } else {
            if (!(this instanceof SHA1)) {
                return new SHA1();
            }
        }

        return this;
    }

    SHA1.prototype = new SHA1();
    SHA1.prototype.blocksize = 64;
    SHA1.prototype.hash = function (m) {
        var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
            K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],
            lb, hb,
            l, pad, ml, blocks, b, block, bl, w, i, A, B, C, D, E, t, n, TEMP;

        function fn(t, B, C, D) {
            switch (t) {
                case 0:
                    return (B & C) | ((~B) & D);
                case 1:
                case 3:
                    return B ^ C ^ D;
                case 2:
                    return (B & C) | (B & D) | (C & D);
            }

            return -1;
        }


        if (m.constructor === String) {
            m = stringToByteArray(m.encodeUTF8());
        }

        l = m.length;

        pad = (Math.ceil((l + 9) / this.blocksize) * this.blocksize) - (l + 9);

        hb = (Math.floor(l / 4294967296));
        lb = (Math.floor(l % 4294967296));

        ml = [
            ((hb * 8) >> 24) & 255,
            ((hb * 8) >> 16) & 255,
            ((hb * 8) >> 8) & 255,
            (hb * 8) & 255,
            ((lb * 8) >> 24) & 255,
            ((lb * 8) >> 16) & 255,
            ((lb * 8) >> 8) & 255,
            (lb * 8) & 255
        ];

        m = m.concat([0x80], zeroPad(pad), ml);

        blocks = Math.ceil(m.length / this.blocksize);

        for (b = 0; b < blocks; b++) {
            block = m.slice(b * this.blocksize, (b+1) * this.blocksize);
            bl = block.length;

            w = [];

            for (i = 0; i < bl; i++) {
                w[i >>> 2] |= block[i] << (24 - (i - ((i >> 2) * 4)) * 8);
            }

            A = H[0];
            B = H[1];
            C = H[2];
            D = H[3];
            E = H[4];

            for (t=0; t < 80; t++) {
            if (t >= 16) {
                w[t] = leftrotate(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
            }

            n = Math.floor(t / 20);
            TEMP = leftrotate(A, 5) + fn(n, B, C, D) + E + K[n] + w[t];

            E = D;
            D = C;
            C = leftrotate(B, 30);
            B = A;
            A = TEMP;
            }

            H[0] += A;
            H[1] += B;
            H[2] += C;
            H[3] += D;
            H[4] += E;
        }

        return wordsToByteArray(H);
    };

    function HMAC(fn, key, message, toHex){
        var k = stringToByteArray(key), m = stringToByteArray(message),
            l = k.length, byteArray, oPad, iPad, i;

        if (l > fn.blocksize) {
            k = fn.hash(k);
            l = k.length;
        }

        k = k.concat(zeroPad(fn.blocksize - l));

        oPad = k.slice(0); // copy
        iPad = k.slice(0); // copy

        for (i = 0; i < fn.blocksize; i++) {
            oPad[i] ^= 0x5C;
            iPad[i] ^= 0x36;
        }

        byteArray = fn.hash(oPad.concat(fn.hash(iPad.concat(m))));

        if (toHex) {
            return byteArrayToHex(byteArray);
        }
        return byteArrayToString(byteArray);
    }

    return OAuth;
})(exports);
var exports = exports || this;
(function (global) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    /**
     * Base64 encode a string
     * @param string {string} the string to be base64 encoded
     */
    global.btoa = global.btoa || function (string) {
        var i = 0, length = string.length, ascii, index, output = '';

        for (; i < length; i+=3) {
            ascii = [
                string.charCodeAt(i),
                string.charCodeAt(i+1),
                string.charCodeAt(i+2)
            ];

            index = [
                ascii[0] >> 2,
                ((ascii[0] & 3) << 4) | ascii[1] >> 4,
                ((ascii[1] & 15) << 2) | ascii[2] >> 6,
                ascii[2] & 63
            ];

            if (isNaN(ascii[1])) {
                index[2] = 64;
            }
            if (isNaN(ascii[2])) {
                index[3] = 64;
            }

            output += b64.charAt(index[0]) + b64.charAt(index[1]) + b64.charAt(index[2]) + b64.charAt(index[3]);
        }

        return output;
    };
})(exports);;/* 
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