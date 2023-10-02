import pyodbc

# Replace 'your_mdb_file.mdb' with the path to your MDB file
mdb_file_path = r'Y:\EndTester.mdb'

# Replace 'YourTableName' with the name of the table you want to query
table_name = 'Data'

try:
    # Establish a connection to the MDB file using the file path
    conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={mdb_file_path};'
    conn = pyodbc.connect(conn_str)

    # Create a cursor
    cursor = conn.cursor()

    # Execute a query to retrieve data from the specified table
    cursor.execute(f'SELECT SN, DCType, PCBDataMatrix FROM {table_name}')

    # Fetch and print the data
    for row in cursor.fetchall():
        print(row)

    # Close the cursor and the connection
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
