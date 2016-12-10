angular.module('OnlineMusicLibrary').controller('loginController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                    .then(function () {
                        $location.path('/playlists');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });

            };

        }]);

angular.module('OnlineMusicLibrary').controller('logoutController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        $location.path('/');
                    });

            };

        }]);

angular.module('OnlineMusicLibrary').controller('registerController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                AuthService.register($scope.registerForm.username, $scope.registerForm.password)
                // handle success
                    .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong! The username already exists";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };

        }]);
// angular.module('OnlineMusicLibrary')
//     .controller('EmptyCtrl',
//     ['$scope', '$http', '$location',
//         function($scope, $http, $location){
//     $location.path("/home")
// }]);
angular.module('OnlineMusicLibrary').controller('mainCtrl',
    ['$scope', '$http', 'formDataObject', '$location',
        function($scope, $http, formDataObject, $location) {
    $scope.formData = new FormData();
    $scope.error = {};
    $scope.files = {};

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's files collection
            console.log("File Selected: ");
            console.log(args.file);
            $scope.files = args.file;
        });
    });

    // when landing on the page, get all todos and show them
    $http.get('/songs')
        .success(function(data) {
            $scope.songs = data.songs;
            console.log("Songs received from GET: ");
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ');
            console.log(data);
        });


    // when submitting the add form, send the text to the node API
    $scope.submitSong = function() {
        $scope.fileToUpload = {};

        var file = document.getElementById("file");
        console.log(file);

        if ($scope.formData.title != null && $scope.formData.artist != null) {
            $http({
                method:"post",
                url: '/songs',
                headers: { 'Content-Type': undefined },
                transformRequest: formDataObject,
                data: { model: $scope.formData, files: $scope.files }})
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    angular.element("input[type='file']").val(null);
                    $scope.songs = data.songs;
                    console.log("Song Data to submit: ");
                    console.log(data);
                })
                .error(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    console.log('Error: ');
                    console.log(data);
                    angular.element("input[type='file']").val(null);
                });
        } else {
            $scope.error.artist = true;
        }
    };
    //
    // // delete a todo after checking it
    $scope.removeSong = function(id) {
        $http.delete('/songs/' + id)
            .success(function(data) {
                $scope.songs = data.songs;
                console.log("Removing Song: ");
                console.log(data);
            })
            .error(function(data) {
                console.log('Error Removing Song: ');
                console.log(data);
            });
    };

}]);

app.factory('formDataObject', function() {
    return function (data) {
        var formData = new FormData();
        console.log("song title: ")
        console.log(data.model.title);
        //need to convert our json object to a string version of json otherwise
        // the browser will do a 'toString()' on the object which will result
        // in the value '[Object object]' on the server.
        formData.append("title", data.model.title);
        formData.append("artist", data.model.artist);
        //now add all of the assigned files
        formData.append("upload" , data.files);

        return formData;
    };
});
