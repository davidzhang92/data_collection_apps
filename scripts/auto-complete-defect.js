$(function () {
    var getData = function (request, response) {
        $.getJSON(
            "http://localhost:5000/api/auto_complete_defect_no_api",
            { term: request.term },
            function (data) {
                var items = [];
                $.each(data, function (index, item) {
                    items.push(item.defect_no);
                });
                response(items);
            }
        );
    };

    var selectItem = function (event, ui) {
        $("#defect-code-field").val(ui.item.value);

        $.getJSON(
            "http://localhost:5000/api/auto_complete_defect_name_api",
            { defectCodeField: ui.item.value },
            function (data) {
                // Check if data is an array and has at least one item
                if (Array.isArray(data) && data.length > 0) {
                    // Select the "part_description" and "id" properties from the first object in the array
                    var defectDescription = data[0].defect_description;
                    var defectId = data[0].id;
    
                    // Populate the #pdesc and update the "part-id" attribute of #pname
                    $("#defect-desc").val(defectDescription);
                    $("#defect-code-field").attr("defect-id", defectId);
                } else {
                    // Handle the case where no data is returned or the data format is unexpected
                    $("#defect-desc").val("No description available");
                    $("#defect-code-field").attr("defect-id", ""); // Clear the "part-id" attribute

                    
                }
            }
        );
        // Hide the autocomplete suggestion window after selecting an item
        $("#defect-code-field").autocomplete("close");
    };

    // Add an event listener to #pname input field to detect changes
    $("#defect-code-field").on("input", function () {
        var pnameValue = $(this).val();
        if (!pnameValue) {
            // If pnameValue is empty, clear #pdesc and part-id attribute in pname
            $("#defect-desc").val("");
            $("#defect-code-field").attr("defect-id","");
        }
    });
    $("#defect-code-field").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 2
    });

    // Add a keyup event listener to the input field
    $("#defect-code-field").on("keyup", function (event) {
        if (event.keyCode === 13) {
            // Check if Enter key was pressed
            $(this).data("ui-autocomplete")._trigger("select", "autocompleteselect", { item: { value: $(this).val() } });
        }
    });
});
