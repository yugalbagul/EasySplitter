
var easySplitter = angular.module('easySplitter', ["ui.router", "ngMaterial", "ngMdIcons", "ngLodash", 'restangular', "ngStorage"])
.config(function ($stateProvider, $urlRouterProvider, RestangularProvider, $httpProvider) {
    RestangularProvider.setBaseUrl('http://localhost:8090/')
    console.log('Inside Config');
    $stateProvider.state('/login', {
        url: "/login",
        templateUrl: 'templates/login.html',
        controller: 'loginController'
    })
    .state('/', {
        url: "/",
        templateUrl: 'templates/home.html',
        controller: 'homeController'
    })
    .state('/split', {
        url: "/split",
        templateUrl: 'templates/split.html',
        controller: 'splitController'
    })
    $urlRouterProvider.otherwise('/login');
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                console.log("Intercepted");
                console.log(config);
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    } ]);

})

