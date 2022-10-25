const dayInMS = 24 * 60 * 60 * 1000
  const today = new Date()
  const localeDate = daysFromToday => (new Date(today.getTime() + (dayInMS * daysFromToday))).toLocaleDateString("fi")

  const open = [
    {
      number: "1-first",
      dueDate: localeDate(-20),
      amount: "63,92\xa0€",
      paid: false,
      paymentDate: localeDate(-10)
    },
  ]

  for (i = 2; i < 22; i++) {
    open.push({
      number: i,
      dueDate: localeDate(i * 2),
      paid: false,
      amount: (30 + Math.round(Math.random() * 100)) + ",00\xa0€",
      paymentDate: ""
    })
  }

  const paid = []

  for (i = 1; i < 102; i++) {
    paid.push({
      number: 21 + i,
      dueDate: localeDate(i * -11),
      paid: true,
      amount: ((30 + (Math.random() * 100)).toFixed(2) + "\xa0€").replace(".", ",")
    })
  }

  const allItems = [...open, ...paid]

  console.log("Item Counts", "all", allItems.length, "open", open.length, "paid", paid.length);