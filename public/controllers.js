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
angular.module('OnlineMusicLibrary').controller('mainCtrl', ['$scope', '$http', 'addSongFormDataObject', 'createPlaylistFormDataObject', '$location', '$timeout', function($scope, $http, addSongFormDataObject, createPlaylistFormDataObject, $location, $timeout)
{
    $scope.formData = new FormData();
    $scope.error = {};
    $scope.uploadFiles = {};
    $scope.downloadFiles = {};
    $scope.playlists = {};
    $scope.playlist = {};

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's uploadFiles collection
            $scope.uploadFiles = args.file;
        });
    });

    // when landing on the page, get all todos and show them
    // $http.get('/songs')
    //     .success(function(data) {
    //         $scope.songs = data.songs;
    //         console.log("Songs received from GET: ", data);
    //     })
    //     .error(function(data) {
    //         console.log('Error: ', data);
    //     });

    $http.get('/playlists')
        .success(function (data) {
            $scope.playlists = data.playlists;
            console.log("playlists received from GET: ", data);
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // when submitting the add form, send the text to the node API

    $scope.addSongToPlaylist = function() {

        console.log($scope.formData);

        if ($scope.formData.title != null && $scope.formData.artist != null && $scope.playlist != null)
        {
            $http({
                method:"post",
                url: '/playlists',
                headers: { 'Content-Type': undefined },
                transformRequest: addSongFormDataObject,
                data: { model: $scope.formData, playlist: $scope.playlist, files: $scope.uploadFiles,}})
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    angular.element("input[type='file']").val(null);
                    $scope.playlist = data.playlist[0];
                    $http.get('/playlists')
                        .success(function (data) {
                            $scope.playlists = data.playlists;
                            console.log("playlists received from GET: ", data);
                        })
                        .error(function(data) {
                            console.log('Error: ', data);
                        });
                    updateSongTable();
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
            alert("Make sure you have selected a playlist");
        }
    };

    $scope.getPlaylist = function () {
        var playlist = $scope.playlist;
        console.log("The playlist being iterated is: ", playlist);
        var playlists = $scope.playlists;

        console.log("The playlists to choose from are: ", playlists);
    }

    // delete a todo after checking it
    $scope.deleteSong = function(path) {
        $http.delete('/songs/' + $scope.playlist._id, {params: {path: path}})
            .success(function(data) {
                console.log("Data after deleting song: ", data);
                $scope.playlist[0] = data.playlists[0];
                $http.get('/playlists')
                    .success(function (data) {
                        $scope.playlists = data.playlists;
                        console.log("playlists received from GET: ", data);
                    })
                    .error(function(data) {
                        console.log('Error: ', data);
                    });
                updateSongTable();
                console.log("Removing Song: ");
                console.log(data);
            })
            .error(function(data) {
                console.log('Error Removing Song: ');
                console.log(data);
            });
    };
    $scope.deletePlaylist = function() {
        var playlistIDToDelete = $scope.playlist._id;
        $http.delete('/playlists/' + playlistIDToDelete)
            .success(function(data) {
                $scope.playlists = data.playlists;
                console.log("Removing Playlist: ");
                console.log(data);
                $http.get('/playlists')
                    .success(function (data) {
                        $scope.playlists = data.playlists;
                        console.log("playlists received from GET: ", data);
                    })
                    .error(function(data) {
                        console.log('Error: ', data);
                    });
            })
            .error(function(data) {
                console.log('Error Removing Playlist: ');
                console.log(data);
            });
    };

    $scope.createPlaylist = function() {

        var playlistName = document.getElementById("playlistNameInput").value;

        if (playlistName != "" && playlistName != null) {
            $http({
                method:"post",
                url: '/playlists',
                headers: { 'Content-Type': undefined },
                transformRequest: createPlaylistFormDataObject,
                data: { model: $scope.formData}})
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    location.reload();
                })
                .error(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    console.log('Error: ');
                    console.log(data);
                });
        }
    };



}]);

app.factory('addSongFormDataObject', function() {
    return function (data) {
        console.log("song form data object: ", data);
        var formData = new FormData();

        formData.append("title", data.model.title);
        formData.append("artist", data.model.artist);
        formData.append("playlistID", data.playlist._id);
        //now add all of the assigned files
        formData.append("upload" , data.files);

        console.log("form data after appending: ", formData);


        return formData;
    };
});

app.factory('createPlaylistFormDataObject', function() {
    return function (data) {

        var formData = new FormData();

        formData.append("playlistName", data.model.playlistName);

        return formData;
    };
});

function updateSongTable()
{
    var newPlaylist = document.getElementById("newSongButton");
    newPlaylist.style.display = "inline";

    $('#songTable').load(document.URL + ' #songTable');
}

function showPlaylistTextField()
{
    var newPlaylist = document.getElementById("newPlaylist");

    if(newPlaylist.style.display == "none")
    {
        newPlaylist.style.display = "inline";
    }
    else
    {
        newPlaylist.style.display = "none";
    }
}

function showAddSongsForm()
{
    var newSong = document.getElementById("newSong");

    if(newSong.style.display == "none")
    {
        newSong.style.display = "inline";
    }
    else
    {
        newSong.style.display = "none";
    }
}
