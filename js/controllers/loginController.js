easySplitter.controller('loginController', ['$scope', 'lodash', '$mdDialog', '$mdMedia', 'persistService', '$http', '$localStorage', 'apiService', '$rootScope', '$state', function ($scope, _, $mdDialog, $mdMedia, persistService, $http, $localStorage, apiService, $rootScope, $state) {
    $scope.login = function () {
        var formData = {
            email: $scope.user.email,
            password: $scope.user.password
        }

        apiService.signin(formData, function (res) {
            if (res.type == false) {
                alert(res.data)
            } else {
                $localStorage.token = res.data.token;
                console.log(res.data);
                $state.go('/split');
            }
        }, function () {
            $rootScope.error = 'Failed to signin';
        })
    };
    $scope.openSignUp = function (ev) {
        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: './templates/signUpDialog.html',
            parent: angular.element(document.body),
            fullscreen: true,
            clickOutsideToClose: true

        })
        .then(function (answer) {

        }, function () {

        });
    }
    $scope.signup = function () {
        var formData = {
            email: $scope.user.email,
            password: $scope.user.password
        }

        apiService.save(formData, function (res) {
            if (res.type == false) {
                alert(res.data)
            } else {
                $localStorage.token = res.data.token;
                $state.go('/split');
            }
        }, function () {
            $rootScope.error = 'Failed to signup';
        })
    };

    $scope.me = function () {
        apiService.me(function (res) {
            $scope.myDetails = res;
        }, function () {
            $rootScope.error = 'Failed to fetch details';
        })
    };

    $scope.logout = function () {
        apiService.logout(function () {
            $state.go('/split');
        }, function () {
            alert("Failed to logout!");
        });
    };
    $scope.token = $localStorage.token;
    console.log($rootScope.error);
} ]);