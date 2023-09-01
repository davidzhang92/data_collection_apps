$(function () {
    var getData = function (request, response) {
        $.getJSON(
            "http://localhost:5000/api/auto_complete_defect_no_api",
            { term: request.term }, // Pass the term as a query parameter
            function (data) {
                var items = []; // Array to store the autocomplete suggestions
                $.each(data, function (index, item) {
                    items.push(item.defect_no); // Extract the relevant field from the response
                });
                response(items);
            }
        );
    };

    var selectItem = function (event, ui) {
        $("#defect-code-field").val(ui.item.value);

        // Make an additional AJAX request to retrieve the description based on the selected value
        $.getJSON(
            "http://localhost:5000/api/auto_complete_defect_name_api",
            { defectCodeField: ui.item.value }, // Pass the selected value as a query parameter
            function (data) {
                $("#defect-desc").val(data.description);
            }
        );
    };

    $("#defect-code-field").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 2
    });
});
