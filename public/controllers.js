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

angular.module('OnlineMusicLibrary').controller('mainCtrl',
    ['$scope', '$http', 'addSongFormDataObject', 'createPlaylistFormDataObject', '$location', '$timeout', 'AuthService',
        function($scope, $http, addSongFormDataObject, createPlaylistFormDataObject, $location, $timeout, AuthService)
        {
            $scope.currentUser = {};
            $scope.playlists = $scope.currentUser.playlists;
            $scope.formData = new FormData();
            $scope.error = {};
            $scope.uploadFiles = {};
            $scope.downloadFiles = {};
            $scope.playlist = {};

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        $location.path('/');
                    });

            };
            //listen for the file selected event
            $scope.$on("fileSelected", function (event, args) {
                $scope.$apply(function () {
                    //add the file object to the scope's uploadFiles collection
                    $scope.uploadFiles = args.file;
                });
            });


            // Whenever we load the page check the requests to see if there is a current user

            $http.get('/user')
                .success(function (data) {
                    $scope.currentUser = data.user;
                    $scope.playlists = data.user.playlists;
                    console.log("user received from GET: ", data);
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });

            $scope.playTunes = function(path)
            {
                playTunes(path);
            }
            $scope.stopTunes = function()
            {
                stopTunes();
            }

            // when submitting the add form, send the text to the node API

            $scope.addSongToPlaylist = function()
            {
                console.log($scope.formData);
                if ($scope.formData.title != null && $scope.formData.artist != null && $scope.playlist != null)
                {
                    $http({
                        method:"post",
                        url: '/playlists',
                        params: {userId : $scope.currentUser._id},
                        headers: { 'Content-Type': undefined },
                        transformRequest: addSongFormDataObject,
                        data: { model: $scope.formData, playlist: $scope.playlist, files: $scope.uploadFiles,}})
                        .success(function (data) {
                            $scope.formData = {}; // clear the form so our user is ready to enter another
                            angular.element("input[type='file']").val(null);
                            location.reload();
                            $scope.currentUser = data.user;
                            $scope.playlists = data.user.playlists;
                            var id = $scope.playlist._id;
                            var playlists = $scope.playlists;
                            $scope.playlist = getPlaylistWithId(id, playlists);

                            getFileFromS3(playlists[0].songs[0].path);

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

            $scope.getPlaylist  = function (playlist) {
                $scope.playlist = playlist;
            }

            // delete a todo after checking it
            $scope.deleteSong = function(path) {
                $http.delete('/songs/' + $scope.currentUser._id, {params: {songPath: path, playlistID : $scope.playlist._id}})
                    .success(function(data) {
                        console.log("Data after deleting song: ", data);
                        $scope.currentUser = data.user;
                        $scope.playlists = data.user.playlists;
                        location.reload();

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
                $http.delete('/playlists/' + $scope.playlist._id, {params : {userId : $scope.currentUser._id}})
                    .success(function(data) {
                        $scope.playlists = data.playlists;
                        console.log("Removing Playlist: ");
                        console.log(data);
                        $http.get('/playlists' + $scope.currentUser._id)
                            .success(function (data) {
                                $scope.playlists = data.user.playlists;
                                location.reload();
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
                        params: {userId : $scope.currentUser._id},
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
//Data sent to the server
app.factory('addSongFormDataObject', function() {
    return function (data) {

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

function getPlaylistWithId(id, playlists)
{

    for(var i = 0; i < playlists.length; i++)
    {
        if(playlists[i]._id == id)
        {
            return playlists[i];
        }
    }
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

function showAddSongsForm() {
    var newSong = document.getElementById("newSong");

    if (newSong.style.display == "none") {
        newSong.style.display = "inline";
    }
    else {
        newSong.style.display = "none";
    }
}

// Update Functions

function updateSongTable()
{
    var newPlaylist = document.getElementById("newSongButton");
    newPlaylist.style.display = "inline";
    $('#songTable').load(document.URL + ' #songTable');
}

function playTunes(path) {
    var player = document.getElementById("player");
    var newSrc = "https://s3.amazonaws.com/omlsongs/" + path;
    newSrc = newSrc.split(" ").join("%20");
    if(newSrc == player.src)
    {
        return;
    }
    player.src = "https://s3.amazonaws.com/omlsongs/" + path;
    player.load();
    player.play();
}