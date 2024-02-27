from flask import Flask, request, jsonify, make_response
import pyodbc
import uuid
import re
import jwt
import hashlib
import random
import string
from datetime import datetime, timedelta
import pytz

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

SECRET_KEY = 'f9433dd1aa5cac3c92caf83680a6c0623979bfb20c14a78dc8f9e2a97dfd1b4e'
@app.route('/api/update_user_profiles', methods=['PATCH'])
def update_user_profiles():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload


        old_password = data['old_password']
        new_password = data['new_password']
        user_id = uuid.UUID(data['user_id'])

        cursor = conn.cursor()

        # new_password Password complexity check
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$', new_password):
            return jsonify({'message': 'Error: Password must be alphanumeric and at least 8 characters long.'}), 400
        
        # old_password Password verification check
        def authenticate_user_password(stored_salt, stored_hashed_password, old_password):
            # Compute the hash of the provided password with the stored salt
            computed_hash = hashlib.sha512((old_password + stored_salt).encode('utf-8')).hexdigest()

            # Compare the computed hash with the stored hashed password
            return computed_hash == stored_hashed_password  # The provided password is correct
        
        def generate_salt_and_hashed_password(new_password):
            # Generate a salt
            updated_salt = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(25))

            # Hash the password with the salt
            updated_hash_password = hashlib.sha512((new_password + updated_salt).encode('utf-8')).hexdigest()

            return updated_salt, updated_hash_password
        


        # Construct the SQL query to retrieve salt, password_hash for the user

        query = """
                select salt, password_hash from user_master a
                where is_deleted = 0 and id = ?
                """
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result is not None:
            salt, password_hash = result
            is_authenticated = authenticate_user_password(salt, password_hash, old_password)

            if is_authenticated:
                updated_salt, updated_hashed_password = generate_salt_and_hashed_password(new_password) 


                    # Construct the SQL query to update user data
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
                cursor.execute(query, (updated_salt, updated_hashed_password, user_id))
                conn.commit()


                return jsonify({'message': 'Password changed successfully.'})
            else:
                return jsonify({'message': 'Error: Old password is incorrect.'}), 400
        else:
            return jsonify({'message': 'Error: Valid user not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500



