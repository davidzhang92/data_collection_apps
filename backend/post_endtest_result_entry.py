from flask import Flask, request, jsonify
import pyodbc
import uuid
import os

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn_sql = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

# Define a function to generate a unique filename
def get_unique_filename():
    unique_id = str(uuid.uuid4())
    return f"EndTester-{unique_id}.mdb"

@app.route('/api/post_endtest_upload_file', methods=['POST'])
def post_endtest_upload_file():
    try:
        # Get the uploaded file from the request
        uploaded_file = request.files['file']

        if not uploaded_file:
            return jsonify({'message': 'No file selected'}), 400

        # Generate a unique filename for the uploaded MDB file
        new_filename = get_unique_filename()

        # Save the uploaded file with the new filename
        upload_folder = r'C:\data_collection_apps\upload'  # Choose a folder for uploaded files
        uploaded_file_path = os.path.join(upload_folder, new_filename)
        uploaded_file.save(uploaded_file_path)

        # Establish a connection to the uploaded MDB file
        conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={uploaded_file_path};'
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

        # Iterate through the data from the MDB file
        for row in mdb_data:
            idx, dc_type, sn, pcb_data_matrix, date_time = row

            # Check if the DCType value matches a row in the part_master table based on part_description
            cursor_sql.execute("SELECT part_id FROM part_master WHERE part_description = ?", (sn,))
            part_id_row = cursor_sql.fetchone()

            if part_id_row:
                part_id = part_id_row[0]

                # Insert the data into the endtest_result_entry table
                cursor_sql.execute("INSERT INTO endtest_result_entry (id, idx, part_id, dc_type, serial_no, data_matrix, date_created) VALUES (NEWID(), ?, ?, ?, ?, ?, ?)",
                                   (idx, part_id, dc_type, sn, pcb_data_matrix, date_time))

        # Commit the changes to the SQL Server database
        conn_sql.commit()

        # Close the cursor and the connection to the SQL Server database
        cursor_sql.close()

        return jsonify({'message': 'Data inserted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
