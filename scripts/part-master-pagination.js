// source : https://codepen.io/dipsichawan/pen/poyxxVY

var entriesPerPage = 10;
var currentPage = 1;
var totalEntries = 0; // Initialize with 0 initially
var totalPages = 0;

$(document).ready(function(){
    fetchData();
});

function fetchData(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:5000/api/pagination_entries_api',
        dataType: 'json',
        success: function(response){
            totalEntries = response[0].count;
            totalPages = Math.ceil(totalEntries / entriesPerPage);
            
            createPagination(currentPage); // Call createPagination here
        }
    });
}

function createPagination(currentPage) {
    $("#page_container").html("");

    for (var page = startPage; page <= endPage; page++) {
        if (currentPage == page) {
            $("#page_container").append("<li class='page-item disabled' page-id='" + page + "'><a href='javascript:void(0)' class='page-link'>" + page + "</a></li>");
        } else {
            // Generate a button with the page number as its "page-id" attribute
            $("#page_container").append("<li class='page-item'><a href='javascript:void(0)' class='page-link page-number' page-id='" + page + "'>" + page + "</a></li>");
        }
    }

    // Attach the click event handler to the page number buttons
    $("#page_container").on("click", ".page-number", function() {
        var newPage = parseInt($(this).attr("page-id"));
        makeCall(newPage);
    });
    

    // Add the "<<" button to jump to the first page
    if (currentPage == 1) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(1)'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    }

    if (currentPage == 1) {
        $("#page_container").append("<li class='page-item disabled previous'><a href='javascript:void(0)' class='page-link'><</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + (currentPage - 1) + ")'><a href='javascript:void(0)' class='page-link'><</a></li>");
    }

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, startPage + 4);

    if (currentPage > totalPages - 3) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - 4);
    }

    for (var page = startPage; page <= endPage; page++) {
        if (currentPage == page) {
            $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' page-id = " + page + " class='page-link'>" + page + "</a></li>");
        } else {
            // Generate a button with the page number as its "page-id" attribute
            $("#page_container").append("<li class='page-item'><a href='javascript:void(0)' class='page-link page-number' page-id='" + page + "'>" + page + "</a></li>");
        }
    }


    if (currentPage == totalPages) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>></a></li>");
    } else {
        $("#page_container").append("<li class='page-item next' onclick='makeCall(" + (currentPage + 1) + ")'><a href='javascript:void(0)' class='page-link'>></a></li>");
    }

    // Add the ">>" button to jump to the last page
    if (currentPage == totalPages) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + totalPages + ")'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    }
}

function makeCall(newPage) {
    currentPage = newPage;
    createPagination(currentPage);
}



$("#page_container").on("click", ".page-number", function() {
    var newPage = parseInt($(this).attr("page-id"));
    makeCall(newPage);
});

// Call createPagination initially with the desired starting page
var currentPage = 1; // You can set this to the initial page number you want
createPagination(currentPage);