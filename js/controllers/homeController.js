easySplitter.controller('homeController', ['$scope','$location','$state', function ($scope, $location,$state) {
    console.log('Inside Home')
    $state.go('/split');
} ])