const timeTrackerApp = angular.module('TimeTrackerApp', ['ngRoute']);

timeTrackerApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        template: '<h1>Hello</h1>'
    }).when('/entry', {
        templateUrl: '../views/entry.html',
        controller: 'EntryController as vm'
    }).when('/manage', {
        templateUrl: '../views/manage.html',
        controller: 'ManageController as vm'
    }).otherwise({
        template: '<h1>404</h1>'
    });
}]);