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
                    },
                    precision: 0 // Set precision to 0 to display whole numbers
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


            function fetchDataFromAPI() {
                $.getJSON('http://localhost:4000/api/overall_throughput_api', function(data) {
                    console.log('Data from API:', data);
            
                    // Process the data and generate data points
                    const { labels, values } = processData(data);
                    console.log('Processed data:', labels, values);
            
                    // Update the chart data with the dynamic data
                    myChart.data.labels = labels;
                    myChart.data.datasets[0].data = values;
                    myChart.update(); // Update the chart to reflect the changes
                }).fail(function(error) {
                    console.error('Error fetching data from API: ', error);
                });
            }
            
            // Function to process the data and generate data points
            function processData(apiData) {
                const labels = generateLabels();
                const values = new Array(labels.length).fill(0);

                $.each(apiData, function(idx, item) {
                    const date = new Date(item.created_date);
                    const index = labels.indexOf(formatDate(date));

                    if (index !== -1) {
                        const totalEntries = parseInt(item.total_entries);

                        if (totalEntries > values[index]) {
                            values[index] = totalEntries; 
                        }
                    }
                });
                return { labels, values };
            }

            // Function to format a date as HH:00 or HH:30 in UTC
            function formatDate(date) {
                return date.getUTCHours().toString().padStart(2, '0') + ':' +
                    (date.getUTCMinutes() < 30 ? '00' : '30');
            }

            
            // Function to generate labels with 30-minute increments
            function generateLabels() {
                const labels = [];
                let currentTime = new Date();
            
                // Round down minutes to the nearest 30-minute block
                currentTime.setMinutes(Math.floor(currentTime.getMinutes() / 30) * 30);
                currentTime.setSeconds(0);
            
                // Subtract 8 hours from the current time
                currentTime.setHours(currentTime.getHours() - 8);
            
                for (let i = 0; i <= 16; i++) { 
                    const label = currentTime.getHours().toString().padStart(2, '0') + ':' +
                        (currentTime.getMinutes() === 0 ? '00' : '30'); // Display as HH:00 or HH:30
                    labels.push(label); // Add label at the end of array
            
                    // Increment the time after generating the label
                    currentTime.setMinutes(currentTime.getMinutes() + 30);
                }
                return labels;
            }
            
            
            var canvasGraph = document.getElementById("graph1");
            var ctx = canvasGraph.getContext('2d');
            var initialData = {
                labels: generateLabels(),
                datasets: [{
                    label: "My Dataset",
                    data: new Array(17).fill(0), // Initialize with zeros
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(119, 255, 0)",
                    borderWidth: 2,
                    lineTension: 0.1
                }]
            };
            
            var myChart = new Chart(ctx, {
                type: 'line',
                data: initialData,
                options: graphOption
            });
            
            fetchDataFromAPI();
            // Fetch new data from the API and update the chart every 30 minutes
            setInterval(fetchDataFromAPI, 1 * 60 * 1000);
            // setInterval(fetchDataFromAPI, 60000);

            // Update the chart's labels every 15 mins
            setInterval(generateLabels, 1 * 60 * 1000);
            // setInterval(generateLabels, 60000);
                        
            

    // Create a new Chart.js chart for the donut chart   
        //donut 1
    var canvasDonut1 = document.getElementById("donut1");

    var donutData = {
        labels: ["PASS","FAIL"],
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
        labels: ["PASS","FAIL"],
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
        labels: ["PASS","FAIL"],
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
        labels: ["PASS","FAIL"],
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
        labels: ["PASS","FAIL"],
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