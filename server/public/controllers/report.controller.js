timeTrackerApp.controller('ReportController', ['$http', function ($http) {
    console.log('in ReportController');
    let self = this;

    self.labels = [];
    self.datas = [];

    self.getProjectTime = function(){
        $http({
            method: 'GET',
            url: '/report'
        }).then(function(response){
            for(let label of response.data){
                self.labels.push(label.project_name);
                self.datas.push(Number(label.work_hour));
            }

            let ctx = document.getElementById("myChart").getContext('2d');
            let myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: self.labels,
                    datasets: [{
                        label: '# of Times',
                        data: self.datas,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }).catch(function(err){
            console.log(err);
        });
    }

    self.getProjectTime();

    // Highcharts.chart('container', {
    
    //     xAxis: {
    //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    //     },

    //     series: [{
    //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    //     }]
    // });
}]);