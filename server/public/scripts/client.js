const timeTrackerApp = angular.module('TimeTrackerApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngSanitize', 'chart.js']);

timeTrackerApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/entry', {
        templateUrl: '../views/entry.html',
        controller: 'EntryController as vm'
    }).when('/manage', {
        templateUrl: '../views/manage.html',
        controller: 'ManageController as vm'
    }).when('/report', {
        templateUrl: '../views/report.html',
        controller: 'ReportController as vm'
    }).otherwise({
        template: '<h1>404</h1>'
    });
}]);