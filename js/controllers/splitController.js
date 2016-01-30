easySplitter.controller('splitController', ['$scope', 'lodash', '$mdDialog', '$mdMedia', function ($scope, _, $mdDialog, $mdMedia) {
    console.log("Inside Split");

    $scope.selectedDish = 0;
    $scope.nextDishId = 2;
    $scope.dish = {};
    $scope.person = {};
    $scope.nextPersonId = 2;
    $scope.people = [
        {
            "id": 1,
            "firstName": "Yugal",
            "lastName": "Bagul",
            "totalAmount": 0,
            "dishes": []
        },
        {
            "id": 2,
            "firstName": "Pradnya",
            "lastName": "Jadhav",
            "totalAmount": 0,
            "dishes": []
        },
        {
            "id": 3,
            "firstName": "Saurbh",
            "lastName": "Phadnis",
            "totalAmount": 0,
            "dishes": []
        }

    ]
    $scope.allDishes = [
        {
            "id": 1,
            "dishName": "Checken",
            "menuPrice": 100,
            "currentSplitPrice": 100,
            "hadBy": [
               
            ],
            "totalCount": 1,
            "totalPrice": 100,
            "splitCount" : 0
        },
        {
            "id": 2,
            "dishName": "Veg",
            "menuPrice": 100,
            "currentSplitPrice": 100,
            "hadBy": [
                
            ],
            "totalCount": 1,
            "totalPrice": 100,
            "splitCount" : 0
        },

    ]
    //Creating a new dish
    $scope.saveDish = function () {
        var temp = {
            "id": $scope.nextDishId,
            "dishName": $scope.dish.dishName,
            "menuPrice": $scope.dish.menuPrice,
            "currentSplitPrice": $scope.dish.totalCount * $scope.dish.menuPrice,
            "hadBy": [

            ],
            "totalCount": $scope.dish.totalCount,
            "totalPrice": $scope.dish.totalCount * $scope.dish.menuPrice,
            "splitCount" : 0
        };
        $scope.allDishes.push(temp);
        console.log($scope.allDishes);
        $scope.dish = {};
        $mdDialog.hide();
    }




    $scope.addNewDish = function (ev) {

        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: './templates/addNewDish.html',
            parent: angular.element(document.body),
            fullscreen: true,
            clickOutsideToClose: true

        })
        .then(function (answer) {

        }, function () {

        });
    }
    //Creating A new Person
    $scope.addPerson = function (ev) {


        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: './templates/addNewPerson.html',
            parent: angular.element(document.body),
            fullscreen: true,
            clickOutsideToClose: true

        })
        .then(function (answer) {

        }, function () {

        });
    }

    $scope.savePerson = function () {
        var temp = {
            "id": $scope.nextPersonId,
            "totalAmount": 0,
            "dishes": [],
            "firstName": $scope.person.firstName,
            
            "lastName": $scope.person.lastName
        }
        $scope.nextPersonId++;
        $scope.people.push(temp);
        $scope.person = {};
        $mdDialog.hide();
    }



    //Re Calculate
    $scope.reCalculatePeopleTotal = function () {
        var i, j;
        _.each($scope.people, function (person) {
            person.totalAmount = 0;
        });
        _.each($scope.allDishes, function (dish) {
            _.each(dish.hadBy, function (dishPerson) {
                _.each($scope.people, function (person) {
                    if (person.id == dishPerson.id) {
                        person.totalAmount = person.totalAmount + dishPerson.dishAmount;
                    }
                })
            })
        })
        console.log($scope.people);
    }
    $scope.reCalculateDishPrice = function (dishIndex, newPrice) {
        for (var i = 0; i < $scope.allDishes[dishIndex].hadBy.length; i++) {
            $scope.allDishes[dishIndex].hadBy[i].dishAmount = $scope.allDishes[dishIndex].hadBy[i].count * newPrice;
        }
        $scope.reCalculatePeopleTotal();
    }

    //


    $scope.selectDish = function (index) {
        $scope.selectedDish = index;
    }

    $scope.addToDish = function (person, index) {
        var currentDishObj = angular.copy($scope.allDishes[$scope.selectedDish]);
        console.log(currentDishObj);
        var currentPrice = currentDishObj.currentSplitPrice;
        person.count = 1;
        currentDishObj.hadBy.push(person);
        currentDishObj.splitCount++;
        console.log("CurrentSplitPrice:" + currentPrice);
        var newSplitPrice = ((currentDishObj.totalPrice) / currentDishObj.splitCount).toFixed(2);

        console.log("newSplitPrice:" + newSplitPrice);
        $scope.allDishes[$scope.selectedDish] = currentDishObj;
        $scope.reCalculateDishPrice($scope.selectedDish, newSplitPrice)

    }
    $scope.addDishCount = function (person, index, dishIndex) {
        console.log(dishIndex);
        var currentDishObj = angular.copy($scope.allDishes[dishIndex]);
        var currentPrice = currentDishObj.currentSplitPrice;
        person.count++;
        currentDishObj.splitCount++;
        var newSplitPrice = ((currentDishObj.totalPrice) / currentDishObj.splitCount).toFixed(2);
        console.log("newSplitPrice:" + newSplitPrice);
        currentDishObj.hadBy[index] = person;
        currentDishObj.currentSplitPrice = newSplitPrice;
        $scope.allDishes[dishIndex] = currentDishObj;
        $scope.reCalculateDishPrice(dishIndex, newSplitPrice)
        console.log($scope.allDishes);
    }
    $scope.substractDishCount = function (person, index, dishIndex) {
        console.log(dishIndex);
        if (person.count > 1) {
            var currentDishObj = angular.copy($scope.allDishes[dishIndex]);
            var currentPrice = currentDishObj.currentSplitPrice;
            person.count--;
            currentDishObj.splitCount--;
            var newSplitPrice = ((currentDishObj.totalPrice) / currentDishObj.splitCount).toFixed(2);
            console.log("newSplitPrice:" + newSplitPrice);
            currentDishObj.hadBy[index] = person;
            $scope.allDishes[dishIndex] = currentDishObj;
            $scope.reCalculateDishPrice(dishIndex, newSplitPrice)
            console.log($scope.allDishes);
        }
    }

} ])