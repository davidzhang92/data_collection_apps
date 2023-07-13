$(function() {
    $("#pname").autocomplete({
      source: function(request, response) {
        $.ajax({
          url: "http://localhost:5000/api/data",
          dataType: "json",
          data: {
            term: request.term
          },
          success: function(data) {
            response(data);
          }
        });
      },
      minLength: 2,
      select: function(event, ui) {
        $("#pname").val(ui.item.value);
        return false;
      }
    });
  });
  