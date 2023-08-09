var jsondata = {"part_no": "06.205.182","part_name": "test_name_api"}
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:5000/api/update_data_api",
  "method": "PATCH",
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": JSON.stringify(jsondata)
}

$.ajax(settings).done(function (response) {
  console.log(response);
});