
var OnlineMusicLibrary = angular.module('OnlineMusicLibrary', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.notes = {};

    //when landing on the page, get all notes
    $http.get('/notes')
        .success(function(data) {
            $scope.notes = data.message;
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
    $scope.removeNote = function(n) {
        $http.delete('/notes/'+n._id)
            .success(function(data) {
                $scope.notas = data.notas;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

}
function playPause()
{
    var playPause = document.getElementById("playPause");
    var player = document.getElementById("player");
    if(player.paused || player.ended)
    {
        player.play();
        playPause.title = "Pause";
        playPause.innerHTML = "Pause";
    }
    else
    {
        player.pause();
        playPause.title = "Play";
        playPause.innerHTML = "Play";
    }

}

function showLoginModal()
{
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}