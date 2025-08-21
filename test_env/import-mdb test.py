from flask import Flask, request, jsonify
import pyodbc
import uuid
import os

app = Flask(__name__)

# # Load config from YAML

current_file = Path(__file__).resolve()
project_root = current_file.parent.parent  

config_path = project_root /'configs'/'db_config.yml'


with open(config_path, 'r') as file:
    config = yaml.safe_load(file)


conn_str = (
    f"DRIVER={{{config['driver']}}};"
    f"SERVER={config['server']};"
    f"DATABASE={config['database']};"
    f"UID={config['uid']};"
    f"PWD={config['pwd']};"
    f"TrustServerCertificate={config['trust_server_certificate']};"

)

conn = pyodbc.connect(conn_str)

# Define a function to generate a unique filename
def get_unique_filename():
    unique_id = str(uuid.uuid4())
    return f"EndTester-{unique_id}.mdb"

mdb_file_path = r'C:\data_collection_apps\upload\EndTester_2023-09-19_15-29-38.mdb'


# Establish a connection to the uploaded MDB file
conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={mdb_file_path};'
conn_mdb = pyodbc.connect(conn_str)

# Create a cursor for the MDB file
cursor_mdb = conn_mdb.cursor()

# Execute a query to retrieve data from the specified table in the MDB file
cursor_mdb.execute(f'SELECT Idx, DCType, SN, PCBDataMatrix, DateTime FROM Data')

# Fetch and store the data from the MDB file in a list
mdb_data = [row for row in cursor_mdb.fetchall()]

# Close the cursor and the connection to the MDB file
cursor_mdb.close()
conn_mdb.close()

# Create a cursor for the SQL Server connection
cursor_sql = conn_sql.cursor()

# Get the maximum created_date value from the SQL Server database
cursor_sql.execute("SELECT MAX(created_date) FROM endtest_result_entry")
max_sql_datetime = cursor_sql.fetchone()
max_sql_datetime = max_sql_datetime[0] if max_sql_datetime is not None else None  # Set max_sql_datetime to None if it's None

# Get the maximum date_time value from the MDB file
max_mdb_datetime = max(row[4] for row in mdb_data)

# Initialize a list to store rows for insertion
rows_to_insert = []

# Compare the maximum created_date values
if max_sql_datetime is None or max_mdb_datetime > max_sql_datetime:
    # Retrieve all MDB data from SQL latest date up to MDB latest date
    for row in mdb_data:
        idx, dc_type, sn, pcb_data_matrix, date_time = row
        if max_sql_datetime is None or date_time > max_sql_datetime:
            # Check if the part_description matches the DCType
            cursor_sql.execute("SELECT id FROM part_master WHERE part_description = ?", (dc_type,))
            part_id_row = cursor_sql.fetchone()

            if part_id_row is not None and len(part_id_row) > 0:
                part_id = part_id_row[0]
            else:
                part_id = None  # Set part_id to None when there's no match

            # Append the row for insertion
            rows_to_insert.append((idx, part_id, dc_type, sn, pcb_data_matrix, date_time))

# Insert the rows into the endtest_result_entry table
for row_to_insert in rows_to_insert:
    idx, part_id, dc_type, sn, pcb_data_matrix, date_time = row_to_insert
    cursor_sql.execute("INSERT INTO endtest_result_entry (id, idx, part_id, dc_type, serial_no, data_matrix, created_date, is_deleted) VALUES (NEWID(), ?, ?, ?, ?, ?, ?, 0)",
                        (idx, part_id, dc_type, sn, pcb_data_matrix, date_time))

# Commit the changes to the SQL Server database
conn_sql.commit()

# Close the cursor and the connection to the SQL Server database
cursor_sql.close()
