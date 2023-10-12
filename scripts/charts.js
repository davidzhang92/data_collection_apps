$(document).ready(function() {


    // Configuration options for the chart
        //config for bar chart
    var graphOption = {
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'X-axis Label',
                    color: 'white',
                    font: {
                        family: 'Helvetica',
                        size: 18
                    }
                },
                ticks: {
                    color: 'white',
                    font: {
                        family: 'Helvetica',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Y-axis Label',
                    color: 'white',
                    font: {
                        family: 'Helvetica',
                        size: 20
                    }
                },
                ticks: {
                    color: 'white',
                    font: {
                        family: 'Helvetica',
                        size: 16
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'white',
                    font: {
                        family: 'Helvetica',
                        size: 16
                    }
                }
            }
        }
    };

        // config options for the donut chart
    var donutOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                position: 'center',
                color: 'black',
                font: {
                    family: 'Arial',
                    size: 24
                },
                padding: 10
            },
            tooltip:{
                enabled: true,
                
            }
        },

    };


    // Create a new Chart.js chart for the line chart
            //graph 1
    var canvasGraph = document.getElementById("graph1");

    var data = {
        labels: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
        datasets: [{
            label: "My Dataset",
            data: [10, 20, 15, 25, 20, 14, 5, 0, 0, 0, 12, 15, 2, 5, 0, 1, 4],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(119, 255, 0)",
            borderWidth: 2,
            lineTension: 0.3
        }]
    };

    var ctx = canvasGraph.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: graphOption
    });


    // Create a new Chart.js chart for the donut chart   
        //donut 1
    var canvasDonut1 = document.getElementById("donut1");

    var donutData = {
        labels: ["A","B"],
        datasets: [{
            data: [70,30], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 1,
        }]
    };


    var donutCtx = canvasDonut1.getContext('2d');
    var donutChart1 = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });

        //donut 2
    var canvasDonut2 = document.getElementById("donut2");

    var donutData = {
        labels: ["A","B"],
        datasets: [{
            data: [80,20], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 1,
        }]
    };


    var donutCtx = canvasDonut2.getContext('2d');
    var donutChart2 = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });

        //donut 3
    var canvasDonut3 = document.getElementById("donut3");

    var donutData = {
        labels: ["A","B"],
        datasets: [{
            data: [95,5], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 1,
        }]
    };


    var donutCtx = canvasDonut3.getContext('2d');
    var donutChart3 = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });

        //donut 4
    var canvasDonut4 = document.getElementById("donut4");

    var donutData = {
        labels: ["A","B"],
        datasets: [{
            data: [65,35], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 1,
        }]
    };


    var donutCtx = canvasDonut4.getContext('2d');
    var donutChart4 = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });

        //donut 5
    var canvasDonut5 = document.getElementById("donut5");

    var donutData = {
        labels: ["A","B"],
        datasets: [{
            data: [33,64], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 1,
        }]
    };


    var donutCtx = canvasDonut5.getContext('2d');
    var donutChart5 = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });
});