easySplitter.controller('splitController', ['$scope', 'lodash', '$mdDialog', '$mdMedia', 'persistService', 'Restangular', '$http', '$localStorage', function ($scope, _, $mdDialog, $mdMedia, persistService, Restangular, $http, $localStorage) {
    console.log("Inside Split");
    console.log($localStorage.token);


    $scope.selectedDish = 0;
    $scope.nextDishId = 1;
    $scope.dish = {};
    $scope.person = {};
    $scope.nextPersonId = 4;
    $scope.showSplitter = true;
    $scope.totalBill = 0;
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
        },
        {
            "id": 4,
            "firstName": "Shraddhesh",
            "lastName": "Bhandari",
            "totalAmount": 0,
            "dishes": []
        },
        {
            "id": 5,
            "firstName": "Nishank",
            "lastName": "Suman",
            "totalAmount": 0,
            "dishes": []
        },
        {
            "id": 6,
            "firstName": "Ishita",
            "lastName": "Mundada",
            "totalAmount": 0,
            "dishes": []
        },
        {
            "id": 7,
            "firstName": "Samruddhi",
            "lastName": "Naukudkar",
            "totalAmount": 0,
            "dishes": []
        }

    ]
    $scope.allDishes = [


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
            "splitCount": 0
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
        $scope.totalBill = 0;
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
        _.each($scope.people, function (person) {
            $scope.totalBill = $scope.totalBill + person.totalAmount;
        })
        console.log($scope.people);
    }
    $scope.reCalculateDishPrice = function (dishIndex, newPrice) {
        console.log($scope.allDishes[dishIndex]);
        for (var i = 0; i < $scope.allDishes[dishIndex].hadBy.length; i++) {
            $scope.allDishes[dishIndex].hadBy[i].dishAmount = $scope.allDishes[dishIndex].hadBy[i].count * newPrice;
        }
        $scope.reCalculatePeopleTotal();
    }

    //


    $scope.selectDish = function (index) {
        $scope.selectedDish = index;
    }

    $scope.addToDish = function (person, index, dishIndex) {
        var currentDishObj = angular.copy($scope.allDishes[$scope.selectedDish]);
        console.log(currentDishObj);
        var currentPrice = currentDishObj.currentSplitPrice;
        var temp = angular.copy(person);
        temp.count = 1;

        currentDishObj.hadBy.push(temp);
        currentDishObj.splitCount++;
        console.log("CurrentSplitPrice:" + currentPrice);
        var newSplitPrice = ((currentDishObj.totalPrice) / currentDishObj.splitCount).toFixed(2);
        currentDishObj.currentSplitPrice = newSplitPrice;
        console.log("newSplitPrice:" + newSplitPrice);
        $scope.allDishes[$scope.selectedDish] = angular.copy(currentDishObj);
        delete currentDishObj.hadBy;
        var personDishObject = {
            "id": currentDishObj.id,
            "dishName": currentDishObj.dishName,
            "menuPrice": currentDishObj.menuPrice,
            "totalCount": currentDishObj.totalCount,
            "totalAmount": currentDishObj.totalAmount
        }
        person.dishes.push(personDishObject);

        $scope.reCalculateDishPrice($scope.selectedDish, newSplitPrice);
        $scope.createSummary();

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
            currentDishObj.currentSplitPrice = newSplitPrice;
            $scope.allDishes[dishIndex] = currentDishObj;
            $scope.reCalculateDishPrice(dishIndex, newSplitPrice)
            console.log($scope.allDishes);
        }
    }

    $scope.createSummary = function (index) {
        $scope.totalTax = 100;
        $scope.dishBill = [];
        $scope.peopleAmounts = [];
        //persistService.saveRecord($scope.allDishes, $scope.people);
        console.log($scope.people);

    }

    $scope.deleteFromDish = function (person, index, dishIndex) {
        var currentDishObj = angular.copy($scope.allDishes[dishIndex]);
        var currentPrice = currentDishObj.currentSplitPrice;
        currentDishObj.splitCount -= person.count;
        var newSplitPrice = ((currentDishObj.totalPrice) / currentDishObj.splitCount).toFixed(2);
        console.log("newSplitPrice:" + newSplitPrice);


        console.log(currentDishObj.hadBy);
        currentDishObj.currentSplitPrice = newSplitPrice;
        delete currentDishObj.hadBy.splice(index, 1);
        var index = _.findIndex(person.dishes, function (dish) {
            currentDishObj.id == dish.id;
        });
        console.log(index);
        if (index != -1) {
            person.dishes.splice(index, 1);
        }
        $scope.allDishes[dishIndex] = currentDishObj;

        $scope.reCalculateDishPrice(dishIndex, newSplitPrice)
        console.log($scope.allDishes);

    }
} ])