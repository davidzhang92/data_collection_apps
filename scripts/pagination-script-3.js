  // Save a reference to the above pagination components
  const selectTake = document.getElementById("pagination-take")
  const selectInvoice = document.getElementById("invoice-type")
  const pagination = document.querySelector("duet-pagination")


  let urlTake = getHash(location.hash, "take") || "5"
  let urlType = getHash(location.hash, "type") || "all"
  let currPage = getHash(location.hash, "page") || "1"

  // Set select menu items and their values
  selectTake.items = [
    { label: "5", value: "5"},
    { label: "10", value: "10" },
    { label: "15", value: "15" }
  ]

  // Set select menu items and their values
  selectInvoice.items = [
    { label: "all", value: "all"},
    { label: "paid", value: "paid" },
    { label: "open", value: "open" }
  ]

  // try to get current page from url
  pagination.setAttribute("current", currPage)

  // Listen for change events in the select
  selectTake.addEventListener("duetChange", function (e) {
    console.log("Change event detected in select:", e.detail)
    pagination.setAttribute("take",e.detail.value)
    location.hash = setHash(location.hash,"take", e.detail.value)
    getTypeItem();

  })

  // Listen for change events in the select
  selectInvoice.addEventListener("duetChange", function (e) {
    console.log("Change event detected in select (invoice type):", e.detail)
    location.hash = setHash(location.hash,"type", e.detail.value)
    getTypeItem();

  })

  // Listen for change events in the pager
  pagination.addEventListener("duetPageChange", function (e) {
    console.log("Change event detected in pagination:", e.detail)
    location.hash = setHash(location.hash,"page", e.detail.current)
    getTypeItem();
  })

  //javascript functions thatuses filtering and string ops to manipulate any hashes given
  function getHash(hash, key) {
    return hash
      .split("#")
      .find((h) => h.startsWith(key))
      ?.replace(`${key}=`, "");
  }
  function setHash(hash, key, value) {
    let hashArray = hash.split("#").filter((h) => !h.startsWith(key));
    hashArray.push(`${key}=${value}`);
    return hashArray.length > 0
      ? hashArray.reduce((s1, s2) => `${s1}#${s2}`)
      : "";
  }
  function deleteHash(hash, key) {
    let hashArray = hash.split("#").filter((h) => !h.startsWith(key));
    return hashArray.length > 0
      ? hashArray.reduce((s1, s2) => `${s1}#${s2}`)
      : "";
  }

  //simple function that uses the URL HASH as a "store" for values and states
  function getTypeItem(){
    // try to get defined itms from url
    urlTake = getHash(location.hash, "take") || "5"
    urlType = getHash(location.hash, "type") || "all"
    currPage = getHash(location.hash, "page") || "1"

    selectTake.setAttribute("value", urlTake)
    selectInvoice.setAttribute("value", urlType)
    pagination.setAttribute("take", urlTake)
    pagination.setAttribute("current", currPage)

    const take = Number( urlTake)
    const page = Number(currPage) -1 // page starts at 1
    const type = urlType

    let items = []
    if(type === "all"){
      items=allItems;
    }
    if(type === "paid"){
      items=paid;
    }
    if(type === "open"){
      items=open;
    }

    let from = page*take
    let to = from + take

    const maxPages = Math.ceil(items.length / take)
    // if our page counter is higher than the selection that we're working with, assume you want to "jump to the end" of the collection
    if(page >= maxPages) {
      location.hash = setHash(location.hash,"page", maxPages)
      return getTypeItem()
    }

    eTable.rows =items.slice(from, to)
    pagination.total = items.length;
    pagination.take = take;

    return {
      rows: items.slice(from, to),
      total: items.length,
      take
    }
  }

  //Run once for initial state
  getTypeItem();