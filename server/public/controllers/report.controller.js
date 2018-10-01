timeTrackerApp.controller('ReportController', ['$http', function ($http) {
    console.log('in ReportController');
    let self = this;
    let ctx = document.getElementById("myChart").getContext('2d');

    self.report = {};
    self.myChart;

    self.getProjectTime = function () {
        $http({
            method: 'GET',
            url: '/report',
            params: self.report
        }).then(function (response) {
            self.labels = [];
            self.datas = [];
            self.entryCounts = [];

            for (let label of response.data) {
                self.labels.push(label.project_name);
                self.datas.push(Number(label.work_hour));
                self.entryCounts.push(label.entry_count);
            }

            // prevent to show previous data
            if (self.myChart) {
                self.myChart.destroy();
            }

            self.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: self.labels,
                    datasets: [{
                        label: '# of entry',
                        data: self.entryCounts,
                        fill: false,
                        type: 'line'
                    }, {
                        label: 'Hours',
                        data: self.datas,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
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
                            'rgba(255, 159, 64, 1)',
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
                    title: {
                        display: true,
                        text: 'Project Report',
                        fontSize: 25
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }).catch(function (err) {
            console.log(err);
        });
    }

    self.getProjectTime();
}]);