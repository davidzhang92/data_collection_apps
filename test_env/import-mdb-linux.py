import os
import pyodbc

db_path = os.path.join("/data-storage/", "sfdc_apps/uploads", "endtester.mdb")
odbc_connection_str = 'DRIVER={MDBTools};DBQ=%s;' % (db_path)
connection = pyodbc.connect(odbc_connection_str)
cursor = connection.cursor()

query = "SELECT Idx, DCType, SN, PCBDataMatrix, DateTime FROM Data"
cursor.execute(query)
rows = cursor.fetchall()
for row in rows:
    print(row)