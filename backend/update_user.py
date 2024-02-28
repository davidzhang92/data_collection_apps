from flask import Flask, request, jsonify
import pyodbc
import uuid
import re
import os
import hashlib
import random
import string
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

@app.route('/api/update-user', methods=['PATCH'])
@token_required
def update_user():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload


        new_access_level = uuid.UUID(data['access_level'])
        target_user_id = uuid.UUID(data['id'])
        modified_by = uuid.UUID(data['user_id'])

        cursor = conn.cursor()

        # # Check for duplicates
        # user_name_duplicate_query_check = """
        #     SELECT COUNT(id) AS count 
        #     FROM user_master where username = ? and is_deleted  = 0
        # """

        # cursor.execute(user_name_duplicate_query_check, (new_username))
        # user_name_result = cursor.fetchone()

        # # debug
        # # print (user_name_result)
        # # print (access_level_result)
    
        # if user_name_result is not None and user_name_result[0] != 0:
        #     return jsonify({'message': 'Error: Username is already exist'}), 400


        # Construct the SQL query to update the username and password for the given id
        query = "update user_master set access_level = ?, modified_by = ?, modified_date = getdate() where id = ?"

        # Execute the SQL query
        cursor.execute(query, (new_access_level, modified_by, target_user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        # Construct and execute the query to fetch updated data
        success_output_query = "select a.id, a.username, b.access_type, a.modified_date from user_master a inner join access_level_master b on a.access_level=b.id and a.id = ? where a.is_deleted = 0"

        cursor.execute(success_output_query, (target_user_id,))
        updated_data_row  = cursor.fetchone()
        if updated_data_row:
            updated_data = {
                'id': updated_data_row[0],
                'username': updated_data_row[1],
                'access_level': updated_data_row[2],
                'modified_date': updated_data_row[3],
                # '(debug) raw_data_row': list(updated_data_row)  # Include the raw data row here
            }
            return jsonify(updated_data), 200
        else:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        
    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500


@app.route('/api/update-user-password', methods=['PATCH'])
@token_required
def update_user_password():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        target_user_id = uuid.UUID(data['id'])
        new_password = str(data['password'])

        # Password complexity check
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$', new_password):
            return jsonify({'message': 'Error: Password must be alphanumeric and at least 8 characters long.'}), 400
    
        cursor = conn.cursor()

        def generate_salt_and_hashed_password(new_password):
            # Generate a salt
            salt = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(25))

            # Hash the password with the salt
            updated_hash_password = hashlib.sha512((new_password + salt).encode('utf-8')).hexdigest()

            return salt, updated_hash_password

        salt, updated_hash_password = generate_salt_and_hashed_password(new_password)


        # Construct the SQL query to update the part_no and part_description for the given id
        query = """
                update user_master
                set 
                salt =?,
                password_hash = ?,
                modified_date = GETDATE(),
                last_password_change = GETDATE()
                where id = ?
                """


        # Execute the SQL query
        cursor.execute(query, (salt, updated_hash_password, target_user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        # Construct and execute the query to fetch updated data
        success_output_query = "select id, username, access_level, modified_date from user_master where is_deleted = 0 and id = ?"

        cursor.execute(success_output_query, (target_user_id,))
        updated_data_row  = cursor.fetchone()
        if updated_data_row:
            updated_data = {
                'id': updated_data_row[0],
                'username': updated_data_row[1],
                'access_level': updated_data_row[2],
                'modified_date': updated_data_row[3],
                # '(debug) raw_data_row': list(updated_data_row)  # Include the raw data row here
            }
            return jsonify(updated_data), 200
        else:
            return jsonify({'message': 'No data found for the given id.'}), 404


    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
