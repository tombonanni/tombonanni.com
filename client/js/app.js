var myApp = angular.module('myApp', [
  'ngRoute',
  'btford.socket-io']).
  factory('Socket', function(socketFactory){
    return socketFactory();
  }).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeController'});
    $routeProvider.when('/features', {templateUrl: 'partials/features.html', controller: 'featuresController'});
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'projectsController'});
    $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'aboutController'});
    $routeProvider.when('/chat', {templateUrl: 'partials/chat.html', controller: 'chatController'});
    $routeProvider.otherwise({redirectTo: '/home'});

    $locationProvider.html5Mode({enabled: true, requireBase: false});

}])
