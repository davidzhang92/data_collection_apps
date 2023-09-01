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
                $("#pdesc").val(data.description);
            }
        );
    };

    $("#pname").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 2
    });
});
