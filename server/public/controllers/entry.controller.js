timeTrackerApp.controller('EntryController', ['$http', function($http){
    let self = this;

    console.log('in EntryController');

    self.projects = [];
    self.entryForm = {
        date: new Date()
    };

    // delete entry
    self.deleteEntry = function(entry){
        $http({
            method: 'DELETE',
            url: '/entry/delete',
            params: entry
        }).then(function(){
            console.log('deleting an entry is successful');
            self.getEntries();
        }).catch(function(err){
            console.log('error:', err);
            alert('Error with deleting entries');
        });
    }

    // get entries
    self.getEntries = function(){
        $http.get('/entry')
            .then(function(response){
                self.entries = response.data;
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with getting entries');
            });
    }

    // get project list
    self.getProjectList = function(){
        $http.get('/manage')
            .then(function(response){
                self.projects = response.data.rows;
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with getting projects');
            });
    }

    // add entries
    self.addNewEntry = function(newEntry){
        if(newEntry.projectId){
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
        } else {
            alert('You didn\'t select any project!');
        }

    }

    self.getProjectList();
    self.getEntries();

}]);