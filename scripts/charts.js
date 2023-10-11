$(document).ready(function() {
    var canvas_1 = document.getElementById("myChart");

    var data = {
        labels: ["A", "B", "C", "D", "E"],
        datasets: [{
            label: "My Dataset",
            data: [10, 20, 15, 25, 30],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(119, 255, 0)",
            borderWidth: 2,
            lineTension: 0.3
        }]
    };

    // Configuration options for the chart
    var canvas_1Options = {
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

    // Create a new Chart.js chart for the line chart
    var ctx = canvas_1.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: canvas_1Options
    });

    var canvas_2 = document.getElementById("myDonut");

    var donutData = {
        labels: ["B","C"],
        datasets: [{
            data: [70,50], // Value for data point B
            backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
            borderColor: ["rgba(255, 255, 255)"],
            borderWidth: 2,
        }]
    };

    // Configuration options for the donut chart
    var donutOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                position: 'center',
                text: '70%', // Display the percentage in the center
                color: 'black',
                font: {
                    family: 'Arial',
                    size: 24
                },
                padding: 10
            }
        }
    };

    // Create a new Chart.js chart for the donut chart
    var donutCtx = canvas_2.getContext('2d');
    var donutChart = new Chart(donutCtx, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
    });
});