angular.module('OnlineMusicLibrary').factory('AuthService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            // create user variable
            var bUser = null;
            var userObject = {};

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                getUserObject: getUserObject,
                login: login,
                logout: logout,
                register: register
            });

            function isLoggedIn() {
                if(bUser) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserObject()
            {
                return userObject;
            }

            function getUserStatus() {
                return $http.get('/user/status')
                // handle success
                    .success(function (data) {
                        if(data.status){
                            bUser = true;
                        } else {
                            bUser = false;
                        }
                    })
                    // handle error
                    .error(function (data) {
                        bUser = false;
                    });
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/user/login',
                    {username: username, password: password})
                // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.status){
                            console.log("Data: ", data);
                            bUser = true;
                            userObject = data.user;
                            deferred.resolve();
                        } else {
                            bUser = false;
                            userObject = {};
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        bUser = false;
                        userObject = {};
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/user/logout')
                // handle success
                    .success(function (data) {
                        bUser = false;
                        userObject = {};

                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        bUser = false;
                        userObject = {};
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/user/register',
                    {username: username, password: password})
                // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.status){
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

        }]);