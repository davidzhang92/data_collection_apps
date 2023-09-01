from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

@app.route('/api/post-part', methods=['POST'])
def post_part():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_no = data['part_no']
        new_part_description = data['part_description']

        cursor = conn.cursor()

        # Construct the SQL query to update the part_no and part_description for the given id
        query = "insert into part_master  (id, part_no, part_description, created_date, is_deleted) values (newid(), ?, ?, getdate(), 0)"


        # Execute the SQL query
        cursor.execute(query, (new_part_no, new_part_description))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
