$(function () {

    var getData = function (request, response) {
        $.getJSON(
            "http://192.168.100.121:4000/api/auto_complete_part_no_api",
            { term: request.term }, // Pass the term as a query parameter
            function (data) {
                var items = []; // Array to store the autocomplete suggestions
                $.each(data, function (index, item) {
                    items.push({label: item.part_no, value: item.id}); // Extract the relevant field from the response
                });
                response(items);
            }
        );
    };

    var selectItem = function (event, ui) {
        // Update the "part-id" attribute of #pname with the selected item's id
        $("#pname").attr("part-id", ui.item.value);
        // Populate #pname field with item.part_no
        $("#pname").val(ui.item.label);
        // Get the "part-id" attribute of #pname
        var partId = $("#pname").attr("part-id");
    
        // Check if partId has a value
        if (partId) {
            // Make an AJAX request to the API using partId as a parameter
            $.getJSON(
                "http://192.168.100.121:4000/api/auto_complete_part_name_api",
                { part_id: partId }, // Send partId as a query parameter
                function (data) {
                    // Handle the response data as needed
                    if (Array.isArray(data) && data.length > 0) {
                        // Select the "part_description" and "id" properties from the first object in the array
                        var partDescription = data[0].part_description;
                        var partId = data[0].id;

                        // Populate the #pdesc and update the "part-id" attribute of #pname
                        $("#pdesc").val(partDescription);
                        $("#pname").attr("part-id", partId);
                    } else {
                        // Handle the case where no data is returned or the data format is unexpected
                        $("#pdesc").val("No description available");
                        $("#pname").attr("part-id", ""); // Clear the "part-id" attribute
                    }
                }
            );
        }; 
        return false; // Prevent updating input with value
    };
    
    // Add an event listener to #pname input field to detect changes
    $("#pname").on("input", function () {
        var pnameValue = $(this).val();
        if (!pnameValue) {
            // If pnameValue is empty, clear #pdesc and part-id attribute in pname
            $("#pdesc").val("");
            $("#pname").attr("part-id","");
        }
    });

   
    
    $("#pname").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 2
        
    });
});
