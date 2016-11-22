
var OnlineMusicLibrary = angular.module('OnlineMusicLibrary', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.songs = {};

    //when landing on the page, get all songs
    $http.get('/songs')
        .success(function(data) {
            $scope.songs = data.message;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    //when submitting the add form, send the text to the node API
    $scope.createUser = function() {
        $http.post('/users', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.users = data.message;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a user after checking it
    $scope.deleteUser = function(id) {
        $http.delete('/users/' + id)
            .success(function(data) {
                $scope.users = data.message;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    //delete a note
    $scope.removeSong = function(n) {
        $http.delete('/songs/'+n._id)
            .success(function(data) {
                $scope.songs = data.songsy;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}

OnlineMusicLibrary.directive('myAudio', function() {
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
$("#somediv").load('login.html').dialog({modal:true});

