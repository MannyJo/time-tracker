timeTrackerApp.controller('EntryController', ['$http', '$mdDialog', function ($http, $mdDialog) {
    let self = this;

    console.log('in EntryController');

    self.orderBy = '';
    self.reverse = '';
    self.pageNum = 1;
    self.pages = [];
    self.projects = [];
    self.entryForm = {
        date: new Date()
    };

    // order by keyword
    self.orderByKeyword = function (keyword) {
        self.reverse = (self.orderBy === keyword) ? !self.reverse : false;
        self.orderBy = keyword;
    }

    // delete entry
    self.deleteEntry = function (entry) {
        $http({
            method: 'DELETE',
            url: '/entry/delete',
            params: entry
        }).then(function () {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Your entry has been successfully deleted')
                    .textContent('You can see your entries in the history section')
                    .ariaLabel('Your entry has been successfully deleted')
                    .ok('OK')
            );
            self.getEntries();
        }).catch(function (err) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error with deleting entries')
                    .textContent('')
                    .ariaLabel('Error with deleting entries')
                    .ok('OK')
            );
        });
    }

    // get total row count
    self.getPages = function(){
        $http({
            method: 'GET',
            url: '/entry/page'
        }).then(function(response){
            for(let i = 0; i < (parseInt(response.data/10)+1); i++){
                self.pages.push(i+1);
            }
        }).catch(function(err){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error with getting total count')
                    .textContent('')
                    .ariaLabel('Error with getting total count')
                    .ok('OK')
            );
        });
    }

    // get entries with page number
    self.getEntries = function (pageNum) {
        if(!pageNum){
            pageNum = self.pageNum;
        }

        self.pageNum = pageNum;

        $http({
            method: 'GET',
            url: '/entry',
            params: {
                pageNum: pageNum
            }
        }).then(function (response) {
            self.entries = response.data;
        }).catch(function (err) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error with getting entries')
                    .textContent('')
                    .ariaLabel('Error with getting entries')
                    .ok('OK')
            );
        });
    }

    // get project list
    self.getProjectList = function () {
        $http.get('/manage/all')
            .then(function (response) {
                self.projects = response.data.rows;
            }).catch(function (err) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error with getting projects')
                        .textContent('')
                        .ariaLabel('Error with getting projects')
                        .ok('OK')
                );
            });
    }

    // function for making object 
    function makeObjectForServer(newEntry, key) {
        let objectToServer = {};

        // time
        let workTime = newEntry.endTime - newEntry.startTime;
        let workHour = (workTime / 1000 / 60 / 60).toFixed(1);
        // start time
        let startTimeHours = (newEntry.startTime.getHours() < 10) ? '0' + newEntry.startTime.getHours() : newEntry.startTime.getHours() + '';
        let startTimeMinutes = (newEntry.startTime.getMinutes() < 10) ? '0' + newEntry.startTime.getMinutes() : newEntry.startTime.getMinutes() + '';
        // end time
        let endTimeHours = (newEntry.endTime.getHours() < 10) ? '0' + newEntry.endTime.getHours() : newEntry.endTime.getHours() + '';
        let endTimeMinutes = (newEntry.endTime.getMinutes() < 10) ? '0' + newEntry.endTime.getMinutes() : newEntry.endTime.getMinutes() + '';

        if (key === 'add') {
            objectToServer = {
                entry: newEntry.entry,
                project_id: newEntry.projectId,
                work_date: newEntry.date,
                work_hour: workHour,
                start_time: startTimeHours + startTimeMinutes,
                end_time: endTimeHours + endTimeMinutes
            }
        } else if (key === 'update') {
            objectToServer = {
                id: newEntry.id,
                entry: newEntry.entry,
                project_id: newEntry.projectId,
                work_date: newEntry.date,
                work_hour: workHour,
                start_time: startTimeHours + startTimeMinutes,
                end_time: endTimeHours + endTimeMinutes
            }
        }

        return objectToServer;
    }

    // add entries
    self.addNewEntry = function (newEntry, newClntForm) {
        // in entry.html, cannot check select require, so I put conditional for checking project value
        if (newEntry.projectId) {
            let objectToServer = makeObjectForServer(newEntry, 'add');

            $http.post('/entry', objectToServer)
                .then(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Your entry has been successfully added')
                            .textContent('You can see your entries in the history section')
                            .ariaLabel('Your entry has been successfully added')
                            .ok('OK')
                    );
                    self.entryForm = {
                        date: new Date()
                    };
                    // this makes the form like the first time(untouched)
                    newClntForm.$setPristine();
                    newClntForm.$setUntouched();
                    self.getEntries();
                }).catch(function (err) {
                    // if there is duplicated time, show the message of the time
                    if (err.status === 400) {
                        let content = '<b>Duplicated time</b>';

                        for (let time of err.data.duplicated_time) {
                            content += '<br> > ' + time.start_time + ' ~ ' + time.end_time;
                        }

                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(err.data.message)
                                .htmlContent(content)
                                .ariaLabel(err.data.message)
                                .ok('OK')
                        );
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error with adding entries')
                                .textContent('')
                                .ariaLabel('Error with adding entries')
                                .ok('OK')
                        );
                    }
                });
        }
    }

    self.updateEntry = function (ev, entry) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/entry.update.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        }).then(function () {}, function () { });

        // function for update dialog
        function DialogController($scope, $mdDialog) {
            $scope.popupCancel = function () {
                $mdDialog.cancel();
            };

            $scope.projects = self.projects;
            $scope.entry = entry;
            $scope.newEntry = {
                date: new Date(entry.work_date),
                entry: entry.entry,
                id: entry.id
            };

            // update entry
            $scope.updateEntry = function (editedEntry) {
                let objectToServer = makeObjectForServer(editedEntry, 'update');

                $http({
                    method: 'PUT',
                    url: '/entry/update',
                    data: objectToServer
                }).then(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Your entry has been successfully edited')
                            .textContent('You can see your entries in the history section')
                            .ariaLabel('Your entry has been successfully edited')
                            .ok('OK')
                    );
                    self.getEntries();
                    $scope.popupCancel();
                }).catch(function (err) {
                    // if there is duplicated time, show the message of the time
                    if (err.status === 400) {
                        let content = '<b>Duplicated time</b>';

                        for (let time of err.data.duplicated_time) {
                            content += '<br> > ' + time.start_time + ' ~ ' + time.end_time;
                        }

                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(err.data.message)
                                .htmlContent(content)
                                .ariaLabel(err.data.message)
                                .ok('OK')
                        );
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error with editing entries')
                                .textContent('')
                                .ariaLabel('Error with editing entries')
                                .ok('OK')
                        );
                    }
                });
            }
        }
    };

    self.getPages();
    self.getProjectList();
    self.getEntries();

}]);