easySplitter.service('persistService', [function () {
    this.saveRecord = function (allDishes, people) {
        this.allDishes = allDishes;
        this.people = people;
        var reader = new FileReader();
        console.log("reader");
        console.log(reader);
    }
} ])