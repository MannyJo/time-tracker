timeTrackerApp.controller('ManageController', ['$http', function($http){
    let self = this;

    console.log('in ManageController');

    self.projectForm = {};

    self.getProjectList = function(){
        $http.get('/manage')
            .then(function(response){
                console.log('Response : ', response);
            }).catch(function(error){
                console.log('error:', error);
                alert('Error with getting projects');
            });
    }

    self.getProjectList();

}]);