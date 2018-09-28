timeTrackerApp.controller('ManageController', ['$http', '$mdDialog', function($http, $mdDialog){
    let self = this;

    console.log('in ManageController');

    self.projects = [];
    self.projectForm = {};

    // get all projects
    self.getProjectList = function(){
        $http.get('/manage')
            .then(function(response){
                console.log('Response : ', response.data);
                self.projects = response.data.rows;
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

    // delete project
    self.deleteProject = function(project) {
        let totTime = Number(project.total_hours);
        if(totTime > 0){
            alert('No No NO NOOOOOOOOO !!!!');
        } else {
            $http({
                method: 'DELETE',
                url: '/manage/delete',
                params: project
            }).then(function(){
                console.log('deleting a project is successful');
                self.getProjectList();
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with deleting project');
            });
        }
    }

    self.updateProjectName = function(ev, id){
        let confirm = $mdDialog.prompt()
            .title('Do you want to change this project name?')
            .textContent('Bowser is a common name.')
            .placeholder('Project Name')
            .ariaLabel('Project Name')
            .initialValue('')
            .targetEvent(ev)
            .required(true)
            .ok('Update the Name!')
            .cancel('I will do later');

        $mdDialog.show(confirm).then(function(result) {
            console.log(result, id);
            $http({
                method: 'PUT',
                url: '/manage/update',
                data: {
                    project_name: result,
                    id: id
                }
            }).then(function(){
                alert('Updated');
                self.getProjectList();
            })
        }, function() {});
    }

    self.getProjectList();

}]);