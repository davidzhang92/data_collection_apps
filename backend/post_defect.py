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

@app.route('/api/post-defect', methods=['POST'])
def post_defect():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_defect_no = data['defect_no']
        new_defect_description = data['defect_description']

        cursor = conn.cursor()

        # Construct the SQL query to update the defect_no and defect_description for the given id
        query = "insert into defect_master  (id, defect_no, defect_description, created_date, is_deleted) values (newid(), ?, ?, getdate(), 0)"


        # Execute the SQL query
        cursor.execute(query, (new_defect_no, new_defect_description))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
