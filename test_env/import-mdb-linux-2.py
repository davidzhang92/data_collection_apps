import pyodbc

# set up some constants
MDB = '/data-storage/sfdc_apps/uploads/endtester.mdb'  # replace with your .mdb file path
DRV = '{Microsoft Access Driver (*.mdb)}'


# connect to db
con = pyodbc.connect('DRIVER={};DBQ={}'.format(DRV, MDB))
cur = con.cursor()

# run a query and get the results
SQL = 'SELECT * FROM Data;'  # replace with your query
rows = cur.execute(SQL).fetchall()

cur.close()
con.close()
