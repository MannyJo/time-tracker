timeTrackerApp.controller('ManageController', ['$http', function($http){
    let self = this;

    console.log('in ManageController');

    self.projectForm = {};

    // get all projects
    self.getProjectList = function(){
        $http.get('/manage')
            .then(function(response){
                console.log('Response : ', response.data);
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with getting projects');
            });
    }

    // add new project
    self.addNewProject = function(newProject){
        console.log(newProject);
        $http.post('/manage', newProject)
            .then(function(){
                console.log('Added new project');
                self.projectForm.projectName = '';
                self.getProjectList();
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with adding projects');
            });
    }

    self.getProjectList();

}]);