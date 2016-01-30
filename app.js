
var easySplitter = angular.module('easySplitter', ["ui.router","ngMaterial","ngMdIcons","ngLodash"])
.config(function ($stateProvider,$urlRouterProvider) {
    console.log('Inside Config');
    $stateProvider.state('/', {
        url: "/",
        templateUrl: 'templates/home.html',
        controller: 'homeController'
    })
    .state('/split', {
        url:"/split",
        templateUrl: 'templates/split.html',
        controller: 'splitController'
    })
   $urlRouterProvider.otherwise('/');

})
