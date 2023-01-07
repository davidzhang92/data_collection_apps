const tableRows = document.querySelectorAll('tbody tr');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentPage = 1;
const rowsPerPage = 5;

function showPage(page) {
  // Hide all rows
  tableRows.forEach(row => row.style.display = 'none');

  // Show only the rows for the current page
  for (let i = (page - 1) * rowsPerPage; i < page * rowsPerPage; i++) {
    if (tableRows[i]) {
      tableRows[i].style.display = 'table-row';
    }
  }
}

// Show the first page by default
showPage(currentPage);

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < tableRows.length / rowsPerPage) {
    currentPage++;
    showPage(currentPage);
  }
});

// CRUD

const tableRows = document.querySelectorAll('tbody tr');
const editButtons = document.querySelectorAll('.edit-btn');
const deleteButtons = document.querySelectorAll('.delete-btn');

// Edit button click listener
editButtons.forEach(button => {
  button.addEventListener('click', e => {
    // Get the row data
    const row = e.target.parentNode.parentNode;
    const id = row.querySelector('td:first-child').textContent;
    const name = row.querySelector('td:nth-child(2)').textContent;
    const age = row.querySelector('td:nth-child(3)').textContent;

    // Show the edit form with the current data
    showEditForm(id, name, age);
  });
});

// Delete button click listener
deleteButtons.forEach(button => {
  button.addEventListener('click', e => {
    // Get the row data
    const row = e.target.parentNode.parentNode;
    const id = row.querySelector('td:first-child').textContent;

    // Send a DELETE request to the server to delete the data
    sendAjaxRequest('DELETE', `/api/data/${id}`, null, () => {
      // Remove the row from the table
      row.remove();
    });
  });
});

// Show the edit form
function showEditForm(id, name, age) {
  // Create the form elements
  const form = document.createElement('form');
  const inputId = document.createElement

  