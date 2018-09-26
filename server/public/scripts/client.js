const timeTrackerApp = angular.module('TimeTrackerApp', ['ngRoute']);

timeTrackerApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        template: '<h1>Hello</h1>'
    }).when('/entry', {
        templateUrl: '../views/entry.html',
        controller: 'EntryController as vm'
    })
}]);