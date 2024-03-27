
$(document).ready(function() {

    // set the zoom level based on resolution
    var screenWidth = window.innerWidth;
    var zoomLevel;

    if (screenWidth <= 1600) {
        zoomLevel = 0.75; 
    }
    $('body').css('zoom', zoomLevel);
    // Calculate the screen width
    var screenWidth = window.screen.width;
    // Calculate the desired zoom level based on the screen width
    var zoomLevel = screenWidth / 1920; // Adjust  according to your base resolution
    // Apply the zoom level to the body
    $('body').css('zoom', zoomLevel);

    // Activate tooltip
	$('[data-toggle="tooltip"]').tooltip()


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


    // Create a new Chart.js chart for the line chart
            //graph 1


    function fetchDataFromAPI() {
        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/overall_throughput_api',
            dataType: 'json',
            headers: {
                'Authorization': localStorage.getItem('accessToken')
            },
            success: function(data) {
                console.log('Data from API:', data);
    
                // Process the data and generate data points
                const { labels, values } = processData(data);
                console.log('Processed data:', labels, values);
    
                // Update the chart data with the dynamic data
                myChart.data.labels = labels;
                myChart.data.datasets[0].data = values;
                myChart.update(); // Update the chart to reflect the changes
            },
            error: function(error) {
                console.error('Error fetching data from API: ', error);
            }
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
                
    

    // Populate the table
    function renderData(data) {
		var tableBody = $('#table-content tbody');
		tableBody.empty(); // Clear the existing table data
	  
		if (!Array.isArray(data)) {
		  console.error('Invalid data format. Expecting an array.');
		  return;
		}
	  
		if (data.length === 0) {
		  console.log('No data received from the API.');
		  return;
		}
	  
		data.forEach(function (part) {
    
            var row = `<tr part-id="${part.part_id}">
            <td class="fixed-width model-id-${part.part_id}  id="model-width" style="border-right: 1px solid white;">${part.part_no}<br>${part.part_description}</td>
            <td class="fixed-width-thead" id="programming-pass-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="programming-fail-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="programming-total-count-${part.part_id}" style="border-right: 1px solid white;">-</td>
            <td class="fixed-width-thead" id="leaktest-pass-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="leaktest-fail-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="leaktest-total-count-${part.part_id}" style="border-right: 1px solid white;">-</td>
            <td class="fixed-width-thead" id="endtest-pass-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="endtest-fail-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="endtest-total-count-${part.part_id}" style="border-right: 1px solid white;">-</td>
            <td class="fixed-width-thead" id="laser-pass-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="laser-fail-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="laser-total-count-${part.part_id}" style="border-right: 1px solid white;">-</td>
            <td class="fixed-width-thead" id="oqc-pass-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="oqc-fail-count-${part.part_id}">-</td>
            <td class="fixed-width-thead" id="oqc-total-count-${part.part_id}">-</td>
            </tr>`;
        
            tableBody.append(row);
            });
    }

    function fetchDataTable() {
        return $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/dashboard_part_id_api',
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
            },	
            success: function (data) {
                renderData(data);
            },
            error: function (xhr, error) {
                if (xhr.status === 401) {
                    alert(xhr.responseJSON.message);
                    localStorage.removeItem('accessToken');
                } else if (xhr.status >= 400 && xhr.status < 600) {
                    // alert(xhr.responseJSON.message);
                } else {
                    console.error(error);
                    // alert('An error occurred while retrieving the data.');
                }
            },
        });
    }
    
    function fetchDataDetail() {



        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/dashboard_part_detail_counts_api',
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
            },	
            success: function (data_count) {
                // loop thru to all data to update data in the table
                $.each(data_count, function(index, part) {
                    let row = $('#table-content tbody').find(`tr[part-id="${part.part_id}"]`);
    
                    if (row.length) {
                        // Update the existing row
                        row.find('.model-id-' + part.part_id).html(`${part.part_no}<br>${part.part_description}`);
                        row.find(`#${part.process_type}-pass-count-${part.part_id}`).text(part.pass_count);
                        row.find(`#${part.process_type}-fail-count-${part.part_id}`).text(part.fail_count);
                        row.find(`#${part.process_type}-total-count-${part.part_id}`).text(part.total_count);
                        // Add similar lines for other process types
                    } else {
                        // Fetch data table only when part id is not found
                        fetchDataTable().done(function() {
                            // You can add any additional logic here after fetchDataTable has completed
                        });
                    }
                }),
                // loop thru to all data to get the pass, fail, total count
                $.each(data_count, function(index, item) {
                    let processes = {
                        programming: {fail_count: 0, pass_count: 0, total_count: 0},
                        leaktest: {fail_count: 0, pass_count: 0, total_count: 0},
                        endtest: {fail_count: 0, pass_count: 0, total_count: 0},
                        laser: {fail_count: 0, pass_count: 0, total_count: 0},
                        oqc: {fail_count: 0, pass_count: 0, total_count: 0}
                    };
                    
                    $.each(data_count, function(index, item) {
                        if (processes.hasOwnProperty(item.process_type)) {
                            processes[item.process_type].fail_count += item.fail_count;
                            processes[item.process_type].pass_count += item.pass_count;
                            processes[item.process_type].total_count += item.total_count;
                    
                            // Update the text of each id element inside the table for its corresponding id
                            $('#' + item.process_type + '-fail').text(processes[item.process_type].fail_count);
                            $('#' + item.process_type + '-pass').text(processes[item.process_type].pass_count);
                            $('#' + item.process_type + '-total').text(processes[item.process_type].total_count);
                        }
                    });
                });
            }
            
            ,
            error: function (xhr, error) {
                if (xhr.status === 401) {
                    alert(xhr.responseJSON.message);
                    localStorage.removeItem('accessToken');
                } else if (xhr.status >= 400 && xhr.status < 600) {
                    // alert(xhr.responseJSON.message);
                } else {
                    console.error(error);
                    // alert('An error occurred while retrieving the data.');
                }
            },
        });
    }
    fetchDataTable()
    fetchDataDetail()
    setInterval(fetchDataDetail, 3000);
    
    

});



