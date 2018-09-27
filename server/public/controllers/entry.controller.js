timeTrackerApp.controller('EntryController', ['$http', function($http){
    let self = this;

    console.log('in EntryController');

    self.projects = [];
    self.entryForm = {
        date: new Date()
    };

    // get entries
    self.getEntries = function(){
        console.log('getting entries');
        $http.get('/entry')
            .then(function(response){
                console.log(response.data.entries);
                console.log(response.data.projects);
                self.projects = response.data.projects;
                self.entries = response.data.entries;
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with getting entries');
            });
    }

    // add entries
    self.addNewEntry = function(newEntry){
        // date
        let year = newEntry.date.getFullYear();
        let month = (newEntry.date.getMonth()+1)<10?'0'+(newEntry.date.getMonth()+1):(newEntry.date.getMonth()+1);
        let date = newEntry.date.getDate()<10?'0'+newEntry.date.getDate():newEntry.date.getDate();

        let workDate = year + '-' + month + '-' + date;

        // time
        let workTime = newEntry.endTime - newEntry.startTime;
        let workHour = (workTime/1000/60/60).toFixed(1);
        
        objectToServer = {
            entry: newEntry.entry,
            project_id: newEntry.projectId,
            work_date: workDate,
            work_hour: workHour
        }

        $http.post('/entry', objectToServer)
            .then(function(){
                console.log('Adding new entry is successful');
                self.getEntries();
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with adding entries');
            });
    }

    self.getEntries();

}]);