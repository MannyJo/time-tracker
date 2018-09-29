timeTrackerApp.controller('ManageController', ['$http', '$mdDialog', function ($http, $mdDialog) {
    let self = this;

    console.log('in ManageController');

    self.orderBy = '';
    self.reverse = '';
    self.projects = [];
    self.projectForm = {};

    // order by keyword
    self.orderByKeyword = function(keyword){
        self.reverse = (self.orderBy===keyword)?!self.reverse:false;
        self.orderBy = keyword;
    }

    // get all projects
    self.getProjectList = function () {
        $http.get('/manage')
            .then(function (response) {
                self.projects = response.data.rows;
            }).catch(function (err) {
                console.log('error:', err);
                alert('Error with getting projects');
            });
    }

    // add new project
    self.addNewProject = function (newProject, newClntForm) {
        $http.post('/manage', newProject)
            .then(function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Added New Project!')
                        .textContent('')
                        .ariaLabel('Added New Project!')
                        .ok('Back to Work')
                );
                self.projectForm = {};
                newClntForm.$setPristine();
                newClntForm.$setUntouched();
                self.getProjectList();
            }).catch(function (err) {
                console.log('error:', err);
                alert('Error with adding projects');
            });
    }

    // delete project
    self.deleteProject = function (project) {
        let totTime = Number(project.total_hours);

        // if there are existing entries under this project
        // show alert that this project cannot be deleted.
        if (totTime > 0) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Can\'t delete this project')
                    .textContent('You should delete entries in this project first')
                    .ariaLabel('Can\'t delete this project')
                    .ok('OK')
            );
        } else {
            let confirm = $mdDialog.confirm()
                .title('Would you like to delete this project?')
                .textContent('Once you delete it, cannot recover anymore')
                .ariaLabel('Would you like to delete this project?')
                .ok('Please do it!')
                .cancel('I will think about it more');

            $mdDialog.show(confirm).then(function(){
                $http({
                    method: 'DELETE',
                    url: '/manage/delete',
                    params: project
                }).then(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('The project has been deleted')
                            .textContent('')
                            .ariaLabel('The project has been deleted')
                            .ok('Back to Work')
                    );
                    self.getProjectList();
                }).catch(function (err) {
                    console.log('error:', err);
                    alert('Error with deleting project');
                });
            }, function() {});
        }
    }

    // update project name when the project is clicked
    self.updateProjectName = function (ev, project) {
        let confirm = $mdDialog.prompt()
            .title('Do you want to change this project name?')
            .textContent('Bowser is a common name.')
            .placeholder('Project Name')
            .ariaLabel('Project Name')
            .initialValue(project.project_name)
            .targetEvent(ev)
            .required(true)
            .ok('Update the Name!')
            .cancel('I will do later');

        $mdDialog.show(confirm).then(function (result) {
            $http({
                method: 'PUT',
                url: '/manage/update',
                data: {
                    project_name: result,
                    id: project.id
                }
            }).then(function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Updating the project name is successful')
                        .textContent('')
                        .ariaLabel('Updating the project name is successful')
                        .ok('OK')
                        .targetEvent(ev)
                );
                self.getProjectList();
            })
        }, function () { });
    }

    self.getProjectList();

}]);