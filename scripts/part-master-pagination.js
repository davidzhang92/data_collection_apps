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
            totalEntries = response[0].count; // Update the global variable with the API response value
            totalPages = Math.ceil(totalEntries / entriesPerPage); // Calculate total pages
            
            createPagination(currentPage);
        }
    });
}


function createPagination(currentPage){
    $("#page_container").html("");

    // Add the "<<" button to jump to the first page
    if(currentPage == 1) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(1)'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    }
    
    if(currentPage == 1){
        $("#page_container").append("<li class='page-item disabled previous'><a href='javascript:void(0)' class='page-link'><</a></li>");
    }else{
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + (currentPage-1) + ")'><a href='javascript:void(0)' class='page-link'><</a></li>");
    }
    
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, startPage + 4);

    if (currentPage > totalPages - 3) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - 4);
    }

    for (var page = startPage; page <= endPage; page++) {
        if (currentPage == page) {
            $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>" + page + "</a></li>");
        } else {
            $("#page_container").append("<li class='page-item' onclick='makeCall(" + page + ")'><a href='javascript:void(0)' class='page-link'>" + page + "</a></li>");
        }
    }
    
    if (currentPage == totalPages){
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>></a></li>");
    }else{
        $("#page_container").append("<li class='page-item next' onclick='makeCall(" + (currentPage+1) + ")'><a href='javascript:void(0)' class='page-link'>></a></li>");
    }

    // Add the ">>" button to jump to the last page
    if(currentPage == totalPages) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + totalPages + ")'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    }
}

function makeCall(newPage){
    currentPage = newPage;
    createPagination(currentPage);
}