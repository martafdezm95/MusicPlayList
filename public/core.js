var app = angular.module('OnlineMusicLibrary', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            // controller: "EmptyCtrl",
            templateUrl: "views/frontPage.html"
        })
        .when("/home", {
            templateUrl: "views/frontPage.html"
        })
        .when("/playlists", {
            controller: "mainCtrl",
            templateUrl: "views/playLists.html"
        })
        .when("/songs", {
            controller: "mainCtrl",
            templateUrl: "views/playLists.html"
        })
        .when("/elements", {
            templateUrl: "views/elements.html"
        })
        .otherwise({redirectTo: "/"});
});

app.controller('EmptyCtrl', function($scope,$http,$location){
    $location.path("/home")
})
app.controller('mainCtrl',['$scope', '$http', 'addSongFormDataObject', 'createPlaylistFormDataObject', '$location', '$timeout', function($scope, $http, addSongFormDataObject, createPlaylistFormDataObject, $location, $timeout) {
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
        } else {

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

app.directive('fileUpload', function ()
{
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                //scope.$emit("fileSelected", { file: files });
                for (var i = 0;i< files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }
            });
        }
    };
});
app.directive('myAudio', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            var player = element.children('.player')[0];
            var playBtn= document.getElementsByClassName('.play');
            var playBtnId= document.getElementById('play');
            element.children('.play').on('click', function() {
                if(player.paused || player.ended){
                    player.play();
                    playBtnId.title='Pause';
                    playBtnId.innerHTML='Pause';
                }
                else{

                    player.pause();
                    playBtnId.title='Play';
                    playBtnId.innerHTML='Play';
                }
            });
        }
    };
});

function openLoginModal()
{
    // Get the modal
    var modal = document.getElementById('loginModal');
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    modal.style.display = "block";
}

// function getPlaylistWithID(id)
// {
//     var playlists = $scope.playlists;
//     for(var i = 0; i< playlists.length; i++)
//     {
//         var playlist = playlists[i];
//         if(playlist._id == id)
//         {
//             console.log("The selected playlist is: ", playlist);
//             return playlist;
//         }
//     }
// }

function updateSongTable()
{
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

$(document).ready(function() {
    $('.fragment i').on('click', function(e) { $(e.target).closest('a').remove(); });
});
$(document).ready( function() {
    $("#load_home").on("click", function() {
        $("#content").load("playLists.html");
    });

});