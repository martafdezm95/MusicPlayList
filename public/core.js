var app = angular.module('OnlineMusicLibrary', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            // controller: "EmptyCtrl",
            templateUrl: "views/frontPage.html",
            access: {restricted: false}
        })
        .when("/home", {
            templateUrl: "views/playlists.html",
            access: {restricted: true}
        })
        .when('/login', {
        templateUrl: 'views/signin.html',
        controller: 'loginController',
        access: {restricted: false}
        })
        .when('/logout', {
            templateUrl: '/views/frontPage.html',
            controller: 'logoutController',
            access: {restricted: true}
        })
        .when('/register', {
            templateUrl: 'views/signup.html',
            controller: 'registerController',
            access: {restricted: false}
        })
        .when("/playlists", {
            controller: "mainCtrl",
            templateUrl: "views/playLists.html",
            access: {restricted: true}
        })
        .when("/songs", {
            controller: "mainCtrl",
            templateUrl: "views/playLists.html",
            access: {restricted: true}
        })
        .when("/elements", {
            templateUrl: "views/elements.html",
            access: {restricted: true}
        })
        .otherwise({redirectTo: "/"});
});

app.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            AuthService.getUserStatus()
                .then(function(){
                    if (next.access.restricted && !AuthService.isLoggedIn()){
                        $location.path('/login');
                        $route.reload();
                    }
                });
        });
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

