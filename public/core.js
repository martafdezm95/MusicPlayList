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
app.controller('mainCtrl',['$scope', '$http', 'formDataObject', '$location', '$timeout', function($scope, $http, formDataObject, $location, $timeout) {
    $scope.formData = new FormData();
    $scope.error = {};
    $scope.files = {};

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {
            //add the file object to the scope's files collection
            console.log(args.file);
            $scope.files = args.file;
        });
    });

    // when landing on the page, get all todos and show them
    $http.get('/songs')
        .success(function(data) {
            $scope.songs = data.songs;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    // when submitting the add form, send the text to the node API
    $scope.submitSong = function() {
        $scope.fileToUpload = {}
        console.log($scope.fileToUpload)
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
                    console.log(data);

                })
                .error(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    console.log('Error: ' + data);
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
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}])

app.factory('formDataObject', function() {
    return function (data) {
        var formData = new FormData();
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

app.directive('fileUpload', function () {
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
$(document).ready(function() {
    $('.fragment i').on('click', function(e) { $(e.target).closest('a').remove(); });
});
$(document).ready( function() {
    $("#load_home").on("click", function() {
        $("#content").load("playLists.html");
    });
});
