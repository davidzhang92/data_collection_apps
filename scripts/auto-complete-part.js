$(function () {
    var getData = function (request, response) {
        $.getJSON(
            "http://localhost:5000/api/auto_complete_part_no_api",
            { term: request.term }, // Pass the term as a query parameter
            function (data) {
                var items = []; // Array to store the autocomplete suggestions
                $.each(data, function (index, item) {
                    items.push(item.part_no); // Extract the relevant field from the response
                });
                response(items);
            }
        );
    };

    var selectItem = function (event, ui) {
        $("#pname").val(ui.item.value);
    
        // Make an additional AJAX request to retrieve the description based on the selected value
        $.getJSON(
            "http://localhost:5000/api/auto_complete_part_name_api",
            { pname: ui.item.value }, // Pass the selected value as a query parameter
            function (data) {
                // Check if data is an array and has at least one item
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
    

    $("#pname").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 2
    });
});
