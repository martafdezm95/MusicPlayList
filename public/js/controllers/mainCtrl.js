/**
 * Created by marta on 30/11/16.
 */
angular.module("OnlineMusicLibrary")
    .controller('mainCtlr', function($scope, $http, $location, TokenService){
        $scope.go = function ( path ) {
            $location.path( path );
        };
        }