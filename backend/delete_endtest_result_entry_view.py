from flask import Flask, request, jsonify
import pyodbc
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
            if access_level not in ['admin']:
                return jsonify({'message': 'Error: You don\'t have sufficient privilege to perform this action.'}), 403
            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Session timed out, please login again.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

@app.route('/api/delete_endtest_result_entry_view', methods=['GET'])
@token_required
def delete_endtest_result_entry_view():
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
            query = f"UPDATE endtest_result_entry  SET deleted_date = getdate(), is_deleted = 1 WHERE id IN ({placeholders})"
            cursor.execute(query, tuple(ids))
        elif id_single:
            # Single record delete
            query = "UPDATE endtest_result_entry  SET deleted_date = getdate(), is_deleted = 1 WHERE id = ?"
            cursor.execute(query, (id_single,))

        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id(s).'}), 404

        return jsonify({'message': 'Data deleted successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
