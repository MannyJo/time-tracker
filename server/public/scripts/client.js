console.log('client.js is loaded');

const timeTrackerApp = angular.module('TimeTrackerApp', ['ngRoute']);

timeTrackerApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        template: '<h1>Hello</h1>'
    })
}]);