const timeTrackerApp = angular.module('TimeTrackerApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

timeTrackerApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        template: '<h2>Hello Kitty You\'re so pretty!</h2>'
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