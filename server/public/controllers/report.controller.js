timeTrackerApp.controller('ReportController', [function () {
    let self = this;

    console.log('in ReportController');

    self.chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        series: ['Foo', 'Baz', 'Bar'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [42, 17, 28, 73, 50, 12, 68]
        ]
    };
}]);