  // Save a reference to the elements
  const eTable = document.querySelector("duet-editable-table");


  // defined actions - if this is not defined, the table will not have any actions
  eTable.actions = [
    {
      "icon": "action-edit-2",
      "color": "primary",
      "name": "edit",
      "size": "x-small",
      "background": "gray-lightest",
      "label": {
        "fi": "Muokkaa luokkaa",
        "en": "Edit category",
        "sv": "Redigera kategori",
      },
    },
    {
      "icon": "action-delete",
      "color": "danger",
      "name": "delete",
      "size": "x-small",
      "background": "gray-lightest",
      "label": {
        "fi": "Poista",
        "en": "Delete",
        "sv": "Radera",
      },
    },
  ];

  //defined columns, if this is set, rows must also be defined for this to have an affect
  eTable.columns = [
    {
      sort_order: 1, direction: 1, index: 0, key: "number",
      label: {
        "en": "#",
        "fi": "#",
        "sv": "#",
      },
    },
    {
      sort_order: 2, direction: -1, index: 1, key: "dueDate",
      label: {
        "fi": "Due date",
        "en": "Due date",
        "sv": "Due date",
      },
    },
    {
      direction: 1, index: 2, key: "amount",
      label: {
        "fi": "Amount",
        "en": "Amount",
        "sv": "Amount",
      },
    },
    {
      direction: 1, index: 3, key: "paymentDate",
      label: {
        "fi": "Paid date",
        "en": "Paid date",
        "sv": "Paid date",
      },
    },
  ];


  eTable.addEventListener("duetActionEvent", function(e) {

    //quick demonstration of how to delete items from the rows array
    console.log("Event received from duet-table: ", e.detail);
    if (e.detail.action === "delete") {
      eTable.rows = eTable.rows.map(item => item.meta.id !== e.detail.meta.id ? item : null).filter(item => item);
    }
    //quick demonstration of how to create the beginnings of a table with edit capabilities
    if (e.detail.action === "edit") {
      const currentRow = eTable.querySelectorAll("tbody tr")[e.detail.meta.index];
      currentRow.contentEditable = true;
      currentRow.classList.toggle("content-editable");
    }
  });

  // function that sorts an array (in this case table.rows) by columns in descending order

  function fieldSorter(fields) {
    return function(a, b) {
      return fields
        .map(function(o) {
          let dir = 1;
          if (o[0] === "-") {
            dir = -1;
            o = o.substring(1);
          }
          if (a[o] > b[o]) return dir;
          if (a[o] < b[o]) return -(dir);
          return 0;
        })
        .reduce(function firstNonZeroValue(p, n) {
          return p ? p : n;
        }, 0);
    };
  }

  //change the sort order of a specific column
  function setSortOrder({ order, direction, index, column }) {
    const newArray = eTable.columns.map((item) => {
      if (item.key === column) {
        // set sort_order to 0, which is ignored in the component as undefined
        item.sort_order = 0;
        // flip direction asc->desc and desc->asc
        item.direction = item.direction === -1 ? 1 : -1;
      }
      return item;
    })
      // sort the array by sort_order thereby getting a 0,1,3,4,x sequence
      .sort(fieldSorter(["sort_order"]))
      // reset that sequence to a 1,2,3,4 situation and ignore anything where sort order was not defined
      .map((item, i) => {
        if (item.sort_order || item.sort_order === 0) {
          item.sort_order = i + 1;
        }
        return item;
      });

    eTable.columns = newArray;

  }

  // Listen for toggle events
  eTable.addEventListener("duetTableToggle", function(e) {
    console.log("Event received from duet-table: ", e.detail);
    setSortOrder({
      order: e.detail.sort_order,
      direction: e.detail.direction,
      index: e.detail.index,
      column: e.detail.key,
    });
  });