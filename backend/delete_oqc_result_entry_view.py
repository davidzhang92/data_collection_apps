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

@app.route('/api/delete_oqc_result_entry_view', methods=['GET'])
def delete_oqc_result_entry_view():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        ids = data.get('ids')  # Get the list of IDs if present, otherwise None
        id_single = data.get('id')  # Get the single ID if present, otherwise None

        if ids is None and id_single is None:
            return jsonify({'message': 'No IDs provided for deletion.'}), 400

        cursor = conn.cursor()

        if ids:
            # Batch delete using the IN clause
            placeholders = ', '.join(['?'] * len(ids))
            query = f"UPDATE oqc_result_entry  SET deleted_date = getdate(), is_deleted = 1 WHERE id IN ({placeholders})"
            cursor.execute(query, tuple(ids))
        elif id_single:
            # Single record delete
            query = "UPDATE oqc_result_entry  SET deleted_date = getdate(), is_deleted = 1 WHERE id = ?"
            cursor.execute(query, (id_single,))

        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id(s).'}), 404

        return jsonify({'message': 'Data deleted successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500