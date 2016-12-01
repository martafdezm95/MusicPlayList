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

app.controller('mainCtrl', function($scope, $http, $location) {
    $scope.formData = {};
    $scope.songs = {};
    $http.get('/songs')
        .success(function(data) {
            $scope.songs = data.message;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.removeSong = function(n) {
        $http.delete('/songs/'+n._id)
            .success(function(data) {
                $scope.songs = data.songsy;
                //location.reload();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    // $scope.getSongs = function () {
    //     $http({
    //         url: '/songs' ,
    //         method: "GET"
    //     }).then(function (data) {
    //             $scope.songs = data.message;
    //             console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // }

})
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
$(document).ready(function() {
    $('.fragment i').on('click', function(e) { $(e.target).closest('a').remove(); });
});
$(document).ready( function() {
    $("#load_home").on("click", function() {
        $("#content").load("playLists.html");
    });
});