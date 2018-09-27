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
            }).catch(function(err){
                console.log('error:', err);
                alert('Error with getting entries');
            });
    }

    // add entries
    self.addNewEntry = function(newEntry){
        console.log(newEntry);
    }

    self.getEntries();

}]);