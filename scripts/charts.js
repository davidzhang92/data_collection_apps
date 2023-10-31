
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
                    text: 'Time',
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
                    text: 'Units',
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
                $.getJSON('http://192.168.100.121:4000/api/overall_throughput_api', function(data) {
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
                    label: "Overall Throughput",
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

        // Declare the chart variable in a higher scope
        var donutChart1;
        var donutChart2;
        var donutChart3;
        var donutChart4;
        var donutChart5;

        // Call the API immediately when the page loads
        fetchDataAndUpdateChartDonut1();
        fetchDataAndUpdateChartDonut2();
        fetchDataAndUpdateChartDonut3();
        fetchDataAndUpdateChartDonut4();
        fetchDataAndUpdateChartDonut5();

        // Then call the API every 1 minute
        setInterval(fetchDataAndUpdateChartDonut1, 2500); // 60 * 1000 milliseconds = 1 minute
        setInterval(fetchDataAndUpdateChartDonut2, 2500);
        setInterval(fetchDataAndUpdateChartDonut3, 2500);
        setInterval(fetchDataAndUpdateChartDonut4, 2500);
        setInterval(fetchDataAndUpdateChartDonut5, 2500);

        //donut 1
        var canvasDonut1 = document.getElementById("donut1");

        var donutData = {
            labels: ["PASS","FAIL"],
            datasets: [{
                data: [1,0], // Initial data
                backgroundColor: ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
                borderColor: ["rgba(255, 255, 255)"],
                borderWidth: 1,
            }]
        };
        

        //function to call donut 1 api and count api

        function fetchDataAndUpdateChartDonut1() {
            fetch('http://192.168.100.121:4000/api/donut_1_api')
                .then(response => response.json())
                .then(data => {
                    // Update the global variables
                    donut1DataPass = data.pass;
                    donut1DataFail = data.fail;
        
                    // Update the chart data
                    if (data.pass === 0 && data.fail === 0) {
                        donutData.datasets[0].data = [1];
                        donutData.datasets[0].backgroundColor = ["rgba(128, 128, 128, 0.6)"];
                        var donutLabel = document.querySelector('#donut-1-container .donut-label');
                        donutLabel.innerText = 'NO DATA';
        
                        // Set these elements to empty strings
                        var partDescriptionElement = document.querySelector('#donut-1-container .donut-1-part-description');
                        var partNoElement = document.querySelector('#donut-1-container .donut-1-part-no');
                        partDescriptionElement.innerText = '';
                        partNoElement.innerText = '';
                    } else {
                        donutData.datasets[0].data = [data.pass, data.fail];
                        donutData.datasets[0].backgroundColor = ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                        var total = data.pass + data.fail;
                        var passPercentage = parseInt((data.pass / total) * 100);
                        var donutLabel = document.querySelector('#donut-1-container .donut-label');
                        donutLabel.innerText = passPercentage.toFixed(0) + '%';
        
                        // Fetch and update the part description and part number
                        fetch('http://192.168.100.121:4000/api/donut_1_details')
                            .then(response => response.json())
                            .then(data => {
                                var partDescriptionElement = document.querySelector('#donut-1-container .donut-1-part-description');
                                var partNoElement = document.querySelector('#donut-1-container .donut-1-part-no');
                                partDescriptionElement.innerText = data.part_description;
                                partNoElement.innerText = data.part_no;
                            })
                            .catch(error => console.error('Error:', error));
                    }
        
                    // If the chart doesn't exist, create it
                    if (!donutChart1) {
                        var donutCtx = canvasDonut1.getContext('2d');
                        donutChart1 = new Chart(donutCtx, {
                            type: 'doughnut',
                            data: donutData,
                            options: donutOptions
                        });
                    } else {
                        // If the chart already exists, update it
                        donutChart1.update();
                    }
        
                    processDonut1Data();
                })
                .catch(error => console.error('Error:', error));
        }
        

        function processDonut1Data() {
            var passValue = parseInt(donut1DataPass, 10);
            var failValue = parseInt(donut1DataFail, 10);
            $("#donut-1-pass").text(passValue);
            $("#donut-1-fail").text(failValue);
            var totalValue = passValue + failValue;
            $("#donut-1-total").text(totalValue);
        }

        //donut 2
    var canvasDonut2 = document.getElementById("donut2");


        //function to call donut 2 api and count api

        function fetchDataAndUpdateChartDonut2() {
            fetch('http://192.168.100.121:4000/api/donut_2_api')
                .then(response => response.json())
                .then(data => {
                    // Update the global variables
                    donut2DataPass = data.pass;
                    donut2DataFail = data.fail;
    
                    // Update the chart data
                    if (data.pass === 0 && data.fail === 0) {
                        donutData.datasets[0].data = [1];
                        donutData.datasets[0].backgroundColor = ["rgba(128, 128, 128, 0.6)"];
                        var donutLabel = document.querySelector('#donut-2-container .donut-label');
                        donutLabel.innerText = 'NO DATA';
    
                        // Set these elements to empty strings
                        var partDescriptionElement = document.querySelector('#donut-2-container .donut-2-part-description');
                        var partNoElement = document.querySelector('#donut-2-container .donut-2-part-no');
                        partDescriptionElement.innerText = '';
                        partNoElement.innerText = '';
                    } else {
                        donutData.datasets[0].data = [data.pass, data.fail];
                        donutData.datasets[0].backgroundColor = ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                        var total = data.pass + data.fail;
                        var passPercentage = parseInt((data.pass / total) * 100);
                        var donutLabel = document.querySelector('#donut-2-container .donut-label');
                        donutLabel.innerText = passPercentage.toFixed(0) + '%';
    
                        // Fetch and update the part description and part number
                        fetch('http://192.168.100.121:4000/api/donut_2_details')
                            .then(response => response.json())
                            .then(data => {
                                var partDescriptionElement = document.querySelector('#donut-2-container .donut-2-part-description');
                                var partNoElement = document.querySelector('#donut-2-container .donut-2-part-no');
                                partDescriptionElement.innerText = data.part_description;
                                partNoElement.innerText = data.part_no;
                            })
                            .catch(error => console.error('Error:', error));
                    }
    
                    // If the chart doesn't exist, create it
                    if (!donutChart2) {
                        var donutCtx = canvasDonut2.getContext('2d');
                        donutChart2 = new Chart(donutCtx, {
                            type: 'doughnut',
                            data: donutData,
                            options: donutOptions
                        });
                    } else {
                        // If the chart already exists, update it
                        donutChart2.update();
                    }
    
                    processDonut2Data();
                })
                .catch(error => console.error('Error:', error));
        }
    
    
        function processDonut2Data() {
            var passValue = parseInt(donut2DataPass, 10);
            var failValue = parseInt(donut2DataFail, 10);
            $("#donut-2-pass").text(passValue);
            $("#donut-2-fail").text(failValue);
            var totalValue = passValue + failValue;
            $("#donut-2-total").text(totalValue);
        }


        //donut 3
    var canvasDonut3 = document.getElementById("donut3");



    //function to call donut 3 api and count api

    function fetchDataAndUpdateChartDonut3() {
        fetch('http://192.168.100.121:4000/api/donut_3_api')
            .then(response => response.json())
            .then(data => {
                // Update the global variables
                donut3DataPass = data.pass;
                // donut3DataFail = data.fail;

                // Update the chart data
                // if (data.pass === 0 && data.fail === 0)
                if (data.pass === 0) {
                    donutData.datasets[0].data = [1];
                    donutData.datasets[0].backgroundColor = ["rgba(128, 128, 128, 0.6)"];
                    var donutLabel = document.querySelector('#donut-3-container .donut-label');
                    donutLabel.innerText = 'NO DATA';

                    // Set these elements to empty strings
                    var partDescriptionElement = document.querySelector('#donut-3-container .donut-3-part-description');
                    var partNoElement = document.querySelector('#donut-3-container .donut-3-part-no');
                    partDescriptionElement.innerText = '';
                    partNoElement.innerText = '';
                } else {
                    donutData.datasets[0].data = [data.pass, data.fail];
                    donutData.datasets[0].backgroundColor = ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                    // var total = data.pass + data.fail;
                    var total = data.pass + 0;
                    var passPercentage = parseInt((data.pass / total) * 100);
                    var donutLabel = document.querySelector('#donut-3-container .donut-label');
                    donutLabel.innerText = passPercentage.toFixed(0) + '%';

                    // Fetch and update the part description and part number
                    fetch('http://192.168.100.121:4000/api/donut_3_details')
                        .then(response => response.json())
                        .then(data => {
                            var partDescriptionElement = document.querySelector('#donut-3-container .donut-3-part-description');
                            var partNoElement = document.querySelector('#donut-3-container .donut-3-part-no');
                            partDescriptionElement.innerText = data.part_description;
                            partNoElement.innerText = data.part_no;
                        })
                        .catch(error => console.error('Error:', error));
                }

                // If the chart doesn't exist, create it
                if (!donutChart3) {
                    var donutCtx = canvasDonut3.getContext('2d');
                    donutChart3 = new Chart(donutCtx, {
                        type: 'doughnut',
                        data: donutData,
                        options: donutOptions
                    });
                } else {
                    // If the chart already exists, update it
                    donutChart3.update();
                }

                processDonut3Data();
            })
            .catch(error => console.error('Error:', error));
    }


    function processDonut3Data() {
        var passValue = parseInt(donut3DataPass, 10);
        // var failValue = parseInt(donut3DataFail, 10);
        $("#donut-3-pass").text(passValue);
        // $("#donut-3-fail").text(failValue);
        // var totalValue = passValue + failValue;
        var totalValue = passValue + 0;
        $("#donut-3-total").text(totalValue);
    }



        //donut 4
    var canvasDonut4 = document.getElementById("donut4");



    function fetchDataAndUpdateChartDonut4() {
        fetch('http://192.168.100.121:4000/api/donut_4_api')
            .then(response => response.json())
            .then(data => {
                // Update the global variables
                donut4DataPass = data.pass;
                donut4DataFail = data.fail;

                // Update the chart data
                if (data.pass === 0 && data.fail === 0) {
                    donutData.datasets[0].data = [1];
                    donutData.datasets[0].backgroundColor = ["rgba(128, 128, 128, 0.6)"];
                    var donutLabel = document.querySelector('#donut-4-container .donut-label');
                    donutLabel.innerText = 'NO DATA';

                    // Set these elements to empty strings
                    var partDescriptionElement = document.querySelector('#donut-4-container .donut-4-part-description');
                    var partNoElement = document.querySelector('#donut-4-container .donut-4-part-no');
                    partDescriptionElement.innerText = '';
                    partNoElement.innerText = '';
                } else {
                    donutData.datasets[0].data = [data.pass, data.fail];
                    donutData.datasets[0].backgroundColor = ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                    var total = data.pass + data.fail;
                    var passPercentage = parseInt((data.pass / total) * 100);
                    var donutLabel = document.querySelector('#donut-4-container .donut-label');
                    donutLabel.innerText = passPercentage.toFixed(0) + '%';

                    // Fetch and update the part description and part number
                    fetch('http://192.168.100.121:4000/api/donut_4_details')
                        .then(response => response.json())
                        .then(data => {
                            var partDescriptionElement = document.querySelector('#donut-4-container .donut-4-part-description');
                            var partNoElement = document.querySelector('#donut-4-container .donut-4-part-no');
                            partDescriptionElement.innerText = data.part_description;
                            partNoElement.innerText = data.part_no;
                        })
                        .catch(error => console.error('Error:', error));
                }

                // If the chart doesn't exist, create it
                if (!donutChart4) {
                    var donutCtx = canvasDonut4.getContext('2d');
                    donutChart4 = new Chart(donutCtx, {
                        type: 'doughnut',
                        data: donutData,
                        options: donutOptions
                    });
                } else {
                    // If the chart already exists, update it
                    donutChart4.update();
                }

                processDonut4Data();
            })
            .catch(error => console.error('Error:', error));
    }


    function processDonut4Data() {
        var passValue = parseInt(donut4DataPass, 10);
        var failValue = parseInt(donut4DataFail, 10);
        $("#donut-4-pass").text(passValue);
        $("#donut-4-fail").text(failValue);
        var totalValue = passValue + failValue;
        $("#donut-4-total").text(totalValue);
    }

        //donut 5
    var canvasDonut5 = document.getElementById("donut5");


    function fetchDataAndUpdateChartDonut5() {
        fetch('http://192.168.100.121:4000/api/donut_5_api')
            .then(response => response.json())
            .then(data => {
                // Update the global variables
                donut5DataPass = data.pass;
                donut5DataFail = data.fail;

                // Update the chart data
                if (data.pass === 0 && data.fail === 0) {
                    donutData.datasets[0].data = [1];
                    donutData.datasets[0].backgroundColor = ["rgba(128, 128, 128, 0.6)"];
                    var donutLabel = document.querySelector('#donut-5-container .donut-label');
                    donutLabel.innerText = 'NO DATA';

                    // Set these elements to empty strings
                    var partDescriptionElement = document.querySelector('#donut-5-container .donut-5-part-description');
                    var partNoElement = document.querySelector('#donut-5-container .donut-5-part-no');
                    partDescriptionElement.innerText = '';
                    partNoElement.innerText = '';
                } else {
                    donutData.datasets[0].data = [data.pass, data.fail];
                    donutData.datasets[0].backgroundColor = ["rgba(119, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                    var total = data.pass + data.fail;
                    var passPercentage = parseInt((data.pass / total) * 100);
                    var donutLabel = document.querySelector('#donut-5-container .donut-label');
                    donutLabel.innerText = passPercentage.toFixed(0) + '%';

                    // Fetch and update the part description and part number
                    fetch('http://192.168.100.121:4000/api/donut_5_details')
                        .then(response => response.json())
                        .then(data => {
                            var partDescriptionElement = document.querySelector('#donut-5-container .donut-5-part-description');
                            var partNoElement = document.querySelector('#donut-5-container .donut-5-part-no');
                            partDescriptionElement.innerText = data.part_description;
                            partNoElement.innerText = data.part_no;
                        })
                        .catch(error => console.error('Error:', error));
                }

                // If the chart doesn't exist, create it
                if (!donutChart5) {
                    var donutCtx = canvasDonut5.getContext('2d');
                    donutChart5 = new Chart(donutCtx, {
                        type: 'doughnut',
                        data: donutData,
                        options: donutOptions
                    });
                } else {
                    // If the chart already exists, update it
                    donutChart5.update();
                }

                processDonut5Data();
            })
            .catch(error => console.error('Error:', error));
    }


    function processDonut5Data() {
        var passValue = parseInt(donut5DataPass, 10);
        var failValue = parseInt(donut5DataFail, 10);
        $("#donut-5-pass").text(passValue);
        $("#donut-5-fail").text(failValue);
        var totalValue = passValue + failValue;
        $("#donut-5-total").text(totalValue);
    }

});

