from flask import Flask, request, jsonify
import pyodbc
import uuid
import os
import subprocess
from functools import wraps
import jwt
from secret_key import SECRET_KEY

app = Flask(__name__)

# # Define your MS SQL Server connection details (Windows)
# server = '192.168.100.121'
# database = 'DataCollection'
# username = 'sa'
# password = 'Cannon45!'

# # Establish the connection
# conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)


# def fetch_data(query):
#     cursor = conn.cursor()
#     cursor.execute(query)
#     rows = cursor.fetchall()
#     return rows


# Define your MS SQL Server connection details (Linux)
# Use the DSN you've defined in your odbc.ini file

dsn = 'DataCollection'

# Establish the connection
conn = pyodbc.connect('DSN=DataCollection;UID=sa;PWD=Cannon45!')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = None

        
        if 'Authorization' in request.headers:
            access_token = request.headers['Authorization']


        if 'x-access-token' in request.headers:
            access_token = request.headers['x-access-token']

        if not access_token:
            return jsonify({'message': 'Session timed out, please login again.'}), 401

        try:
            data = jwt.decode(access_token, SECRET_KEY, algorithms=['HS256'])
            access_level = data.get('access_level')

            # if access_level not in ['read-only', 'operator', 'admin']:
            if access_level not in ['operator', 'admin']:
                return jsonify({'message': 'Error: You don\'t have sufficient privilege to perform this action.'}), 403
            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Session timed out, please login again.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

# Define a function to generate a unique filename
def get_unique_filename():
    unique_id = str(uuid.uuid4())
    return f"EndTester-{unique_id}.mdb"

@app.route('/api/post_endtest_upload_file', methods=['POST'])
@token_required
def post_endtest_upload_file():
    try:
        # Get the uploaded file from the request
        uploaded_file = request.files['file']

        if not uploaded_file:
            return jsonify({'message': 'No file selected'}), 400

        # Generate a unique filename for the uploaded MDB file
        new_filename = get_unique_filename()

        # Save the uploaded file with the new filename
        upload_folder = '/data-storage/sfdc_apps/uploads'  # Choose a folder for uploaded files
        uploaded_file_path = os.path.join(upload_folder, new_filename)
        uploaded_file.save(uploaded_file_path)

        # Establish a connection to the uploaded MDB file
        conn_str = f'DRIVER={{MDBTools}};DBQ={uploaded_file_path};'
        conn_mdb = pyodbc.connect(conn_str)

        # Create a cursor for the MDB file
        cursor_mdb = conn_mdb.cursor()

        # Execute a query to retrieve data from the specified table in the MDB file
        cursor_mdb.execute(f'SELECT Idx, DCType, SN, PCBDataMatrix, TestOK, DateTime FROM Data')

        # Fetch and store the data from the MDB file in a list
        mdb_data = [row for row in cursor_mdb.fetchall()]

        # Close the cursor and the connection to the MDB file
        cursor_mdb.close()
        conn_mdb.close()


        # Create a cursor for the SQL Server connection
        cursor_sql = conn.cursor()

        # Get the maximum created_date value from the SQL Server database
        cursor_sql.execute("SELECT MAX(created_date) FROM endtest_result_entry")
        max_sql_datetime = cursor_sql.fetchone()
        max_sql_datetime = max_sql_datetime[0] if max_sql_datetime is not None else None  # Set max_sql_datetime to None if it's None

        # Get the maximum date_time value from the MDB file
        max_mdb_datetime = max(row[5] for row in mdb_data)

        # Initialize a list to store rows for insertion
        rows_to_insert = []

        # Iterate over the mdb_data and replace 'TestOK' value from bit into 'PASS' if it's 1, 'FAIL' if it's 0
        mdb_data = [row[:4] + ('PASS' if row[4] == 1 else 'FAIL',) + row[5:] for row in mdb_data]

        # Compare the maximum created_date values
        if max_sql_datetime is None or max_mdb_datetime > max_sql_datetime:
            # Retrieve all MDB data from SQL latest date up to MDB latest date
            for row in mdb_data:
                idx, dc_type, sn, pcb_data_matrix, test_ok, date_time = row
                if max_sql_datetime is None or date_time > max_sql_datetime:
                    # Check if the part_description matches the DCType
                    cursor_sql.execute("SELECT id FROM part_master WHERE part_description = ? and is_deleted = 0", (dc_type,))
                    part_id_row = cursor_sql.fetchone()

                    if part_id_row is not None and len(part_id_row) > 0:
                        part_id = part_id_row[0]
                    else:
                        part_id = None  # Set part_id to None when there's no match

                    # Append the row for insertion
                    rows_to_insert.append((idx, part_id, dc_type, sn, pcb_data_matrix, test_ok, date_time))

        # Insert the rows into the endtest_result_entry table
        for row_to_insert in rows_to_insert:
            idx, part_id, dc_type, sn, pcb_data_matrix, test_ok, date_time = row_to_insert
            cursor_sql.execute("INSERT INTO endtest_result_entry (id, idx, part_id, dc_type, serial_no, data_matrix, test_ok, created_date, is_deleted) VALUES (NEWID(), ?, ?, ?, ?, ?, ?, ?, 0)",
                                (idx, part_id, dc_type, sn, pcb_data_matrix, test_ok,date_time))

        # Commit the changes to the SQL Server database
        conn.commit()

        # Close the cursor and the connection to the SQL Server database
        cursor_sql.close()

        return jsonify({'message': 'Data inserted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
 

if __name__ == '__main__':
    app.run()
