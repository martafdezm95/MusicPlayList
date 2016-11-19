
var OnlineMusicLibrary = angular.module('OnlineMusicLibrary', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.notes = {};

    // when landing on the page, get all notes
    $http.get('/notes')
        .success(function(data) {
            $scope.notes = data.message;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
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