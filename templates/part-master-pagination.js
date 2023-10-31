// source : chat gpt

$(document).ready(function() {
  let currentPage = 1;
  const totalEntries = 25; // Replace with your actual total entry count

  function updatePagination() {
    $('#prev-page').toggleClass('disabled', currentPage === 1);
    const totalPages = Math.ceil(parseInt($('#total-entries').text()) / 10);

    const paginationContainer = $('#dynamic-pagination');
    paginationContainer.empty();

    paginationContainer.append('<li class="page-item disabled"><a href="#">Previous</a></li>');

    for (let i = Math.max(currentPage - 2, 1); i <= Math.min(currentPage + 2, totalPages); i++) {
      const isActive = i === currentPage ? ' active' : '';
      paginationContainer.append(`<li class="page-item${isActive}"><a href="#" class="page-link">${i}</a></li>`);
    }

    paginationContainer.append('<li class="page-item"><a href="#" class="page-link">Next</a></li>');
  }

  updatePagination();

  $('.pagination').on('click', '.page-link', function() {
    const pageNumber = parseInt($(this).text());
    
    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      currentPage = pageNumber;
      updatePagination();

      // Perform AJAX call based on the page clicked
      if (pageNumber === currentPage - 1) {
        $.ajax({
          url: 'http://192.168.100.121:5000/api/previous_10_records_api',
          type: 'GET',
          data: {
            currentPage: currentPage
          },
          success: function (data) {
            filteredData = data;
            renderData(filteredData);
          },
          error: function (error) {
            console.error('Error fetching previous 10 records:', error);
          },
        });
      } else if (pageNumber === currentPage - 2) {
        $.ajax({
          url: 'http://192.168.100.121:5000/api/previous_20_records_api',
          type: 'GET',
          data: {
            currentPage: currentPage
          },
          success: function (data) {
            filteredData = data;
            renderData(filteredData);
          },
          error: function (error) {
            console.error('Error fetching previous 20 records:', error);
          },
        });
      } else if (pageNumber === currentPage + 1) {
        $.ajax({
          url: 'http://192.168.100.121:5000/api/next_10_records_api',
          type: 'GET',
          data: {
            currentPage: currentPage
          },
          success: function (data) {
            filteredData = data;
            renderData(filteredData);
          },
          error: function (error) {
            console.error('Error fetching next 10 records:', error);
          },
        });
      } else if (pageNumber === currentPage + 2) {
        $.ajax({
          url: 'http://192.168.100.121:5000/api/next_20_records_api',
          type: 'GET',
          data: {
            currentPage: currentPage
          },
          success: function (data) {
            filteredData = data;
            renderData(filteredData);
          },
          error: function (error) {
            console.error('Error fetching next 20 records:', error);
          },
        });
      } else {
        $.ajax({
          url: 'http://192.168.100.121:5000/api/filter_search_part_master_api',
          type: 'GET',
          data: {
            search_part_no: partNumber,
            search_part_description: partDescription
          },
          success: function (data) {
            filteredData = data;
            renderData(filteredData);
          },
          error: function (error) {
            console.error('Error fetching filtered data:', error);
          },
        });
      }
    }
  });

  $('#prev-page').on('click', function() {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
      $.ajax({
        url: 'http://192.168.100.121:5000/api/previous_10_records_api',
        type: 'GET',
        data: {
          currentPage: currentPage
        },
        success: function (data) {
          filteredData = data;
          renderData(filteredData);
        },
        error: function (error) {
          console.error('Error fetching previous 10 records:', error);
        },
      });
    }
  });

  $('#next-page').on('click', function() {
    const totalPages = Math.ceil(parseInt($('#total-entries').text()) / 10);
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
      $.ajax({
        url: 'http://192.168.100.121:5000/api/next_10_records_api',
        type: 'GET',
        data: {
          currentPage: currentPage
        },
        success: function (data) {
          filteredData = data;
          renderData(filteredData);
        },
        error: function (error) {
          console.error('Error fetching next 10 records:', error);
        },
      });
    }
  });
});