$(document).ready(function () {

	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
    // datepicker function for date to and date from
    $(function() {
        $("#date-from-field").datepicker({
            dateFormat: "yy-mm-dd"
        });
    
        $("#date-to-field").datepicker({
            dateFormat: "yy-mm-dd"
        });
    
       // Add an event listener to the "date-to-field" input
		$("#date-to-field").on("change", function() {
			// Get the selected dates from both fields
			var fromDate = $("#date-from-field").datepicker("getDate");
			var toDate = $("#date-to-field").datepicker("getDate");

			// Check if toDate is smaller (earlier) than fromDate
			if (toDate && fromDate){
				if (toDate < fromDate) {
					// Show an alert message
					$("#date-to-field").val('')
					alert("The end date cannot be earlier than the start date.");
					// You can also reset the "date-to-field" value or take other actions as needed
				}
			}
				
		});
    });


	


});








