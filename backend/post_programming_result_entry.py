from flask import Flask, request, jsonify
import pyodbc
import uuid


app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

@app.route('/api/post-programming-result-entry', methods=['POST'])
def post_programming_result_entry():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_id = uuid.UUID(data['part_id'])
        new_serial_no = str(data['serial_no'])
        new_result = str(data['result'])       
        new_fail_current = int(data['fail_current'])
        new_fail_hr = int(data['fail_hr'])
        new_fail_pairing = int(data['fail_pairing'])
        new_fail_bluetooth = int(data['fail_bluetooth'])
        new_fail_sleep_mode = int(data['fail_sleep_mode'])
        new_fail_other = int(data['fail_other'])     

        cursor = conn.cursor()

        # Construct the SQL query to update the part_no and part_description for the given id
        query = "insert into programming_result_entry (id, part_id, serial_no, result, fail_current, fail_hr, fail_pairing, fail_bluetooth, fail_sleep_mode, fail_other, created_date, is_deleted) values (newid(), ?, ?, ?, ?, ?, ?, ?, ?, ?,  getdate(), 0)"

        # Execute the SQL query
        cursor.execute(query, (new_part_id, new_serial_no, new_result, new_fail_current, new_fail_hr, new_fail_pairing, new_fail_bluetooth, new_fail_sleep_mode, new_fail_other))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        error_message = f'Error occurred while updating data: {str(e)}'
        print(error_message)  # Print the error message to your server's log
        return jsonify({'message': error_message}), 500
