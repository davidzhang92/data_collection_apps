from flask import Flask, request, jsonify
import pyodbc
import uuid
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

@app.route('/api/post-programming-result-entry', methods=['POST'])
@token_required
def post_programming_result_entry():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_id = uuid.UUID(data['part_id'])
        new_serial_no = str(data['serial_no'])
        new_lot_no = str(data['lot_no'])
        user_id = data['user_id']

        ##lot no validation
        if new_lot_no == '' or None:
            return jsonify({'message': 'Error: Lot No cannot be empty.'}), 400

        # Concatenate part_id and serial_no
        concatenated_values = str(new_part_id) + new_serial_no + new_lot_no

        cursor = conn.cursor()

        # Check for duplicates based on the concatenated values
        duplicate_check_query = """
            SELECT COUNT(*) AS count
            FROM programming_result_entry
            WHERE CONCAT(part_id, serial_no, lot_no) = ?
        """
        cursor.execute(duplicate_check_query, (concatenated_values,))
        result = cursor.fetchone()

        if result is not None:
            duplicate_count = result[0]
        else:
            duplicate_count = 0

        if duplicate_count > 0:
            return jsonify({'message': 'Data is a duplicate.'}), 400
        
        

       


        # If no duplicates, insert the data
        new_part_id = uuid.UUID(data['part_id'])
        new_result = str(data['result'])
        new_serial_no = str(data['serial_no'])
        new_lot_no = (data['lot_no'])
        defect_id_param = uuid.UUID(data['defect_id']) if data['defect_id'].strip() else None
        new_remarks = (data['remarks']) if data['remarks'].strip() else None


        # Construct the SQL query to insert the data
        if defect_id_param is None:
            insert_query = """
                insert into programming_result_entry (id, part_id, result, serial_no, lot_no, remarks, created_by, created_date, is_deleted)
                values (NEWID(),?,?,?,?,?,?, GETDATE(), 0)
            """
            cursor.execute(insert_query, (new_part_id, new_result, new_serial_no, new_lot_no, new_remarks, user_id))
        else:
            insert_query = """
                insert into programming_result_entry (id, part_id, defect_id, result, serial_no, lot_no, remarks, created_by, created_date, is_deleted)
                values (NEWID(),?,?,?,?,?,?,?, GETDATE(), 0)
            """
            cursor.execute(insert_query, (new_part_id, defect_id_param, new_result, new_serial_no, new_lot_no, new_remarks, user_id))
        conn.commit()

        return jsonify({'message': 'Data inserted successfully.'}), 200

    except Exception as e:
        error_message = f'Error occurred while inserting data: {str(e)}'
        print(error_message)  # Print the error message to your server's log
        return jsonify({'message': error_message}), 500

if __name__ == '__main__':
    app.run()
