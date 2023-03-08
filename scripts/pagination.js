// get reference to table and pagination controls
const table = document.getElementById("myTable");
const paginationControls = document.getElementById("paginationControls");

// number of rows to display per page
const rowsPerPage = 5;

// create pagination
createPagination(table, rowsPerPage, paginationControls);

// handle click events for pagination controls
paginationControls.addEventListener("click", function(event) {
  event.preventDefault();
  const target = event.target;
  if (target.tagName === "A") {
    const page = target.textContent;
    showPage(table, page, rowsPerPage);
  }
});

// handle click events for edit and delete buttons
table.addEventListener("click", function(event) {
  event.preventDefault();
  const target = event.target;
  if (target.className === "btn-edit") {
    // handle edit button click
  } else if (target.className === "btn-delete") {
    // handle delete button click
  }
});

// create pagination
function createPagination(table, rowsPerPage, paginationControls) {
  // get total number of rows
  const rowCount = table.rows.length;

  // calculate number of pages needed
  const pageCount = Math.ceil(rowCount / rowsPerPage);

  // create pagination links
  for (let i = 0; i < pageCount; i++) {
    const btn = document.createElement("a");
    btn.href = "#";
    btn.textContent = i + 1;
    paginationControls.appendChild(btn);
  }
}

// show specified page
function showPage(table, page, rowsPerPage) {
  // hide all rows
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].style.display = "none";
  }

  // show rows for specified page
  const startRow = (page - 1) * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  for (let i = startRow; i < endRow; i++) {
    table.rows[i].style.display = "table-row";
  }
}
