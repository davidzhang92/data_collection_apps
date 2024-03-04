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
            return jsonify({'message': 'Session timed out, please login again1.'}), 401

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

@app.route('/api/update-defect', methods=['PATCH'])
@token_required
def update_defect():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        id = data['id']
        new_defect_no = data['defect_no']
        new_defect_description = data['defect_description']
        user_id = data['user_id']

        cursor = conn.cursor()

        # Construct the SQL query to update the defect_no and defect_description for the given id
        query = """UPDATE
                defect_master SET defect_no = ?, 
                defect_description = ?, 
                modified_by = ?, 
                modified_date = GETDATE() 
            WHERE id = ? AND is_deleted = 0"""


        # Execute the SQL query
        cursor.execute(query, (new_defect_no, new_defect_description, user_id, id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        # Construct and execute the query to fetch updated data
        success_output_query = """
        SELECT a.id, a.part_no, a.defect_description, b.username, a.modified_date from defect_master a
        LEFT JOIN user_master b ON a.created_by = b.id
        """

        cursor.execute(success_output_query, (id,))
        updated_data_row  = cursor.fetchone()
        if updated_data_row:
            updated_data = {
                'id': updated_data_row[0],
                'defect_no': updated_data_row[1],
                'defect_description': updated_data_row[2],
                'username' : updated_data_row[3],
                'latest_date': updated_data_row[3],
                # '(debug) raw_data_row': list(updated_data_row)  # Include the raw data row here
            }
            return jsonify(updated_data), 200
        else:
            return jsonify({'message': 'No data found for the given id.'}), 404


    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
