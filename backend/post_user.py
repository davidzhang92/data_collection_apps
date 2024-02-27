from flask import Flask, request, jsonify
import pyodbc
import re
import os
import hashlib
import random
import string

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


@app.route('/api/post-user', methods=['POST'])
def post_user():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_username = data['username']
        new_access_level = data['access_level']
        new_password = data['password']
        user_id = data['user_id']

        # Password complexity check
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{8,}$', new_password):
            return jsonify({'message': 'Error: Password must be alphanumeric and at least 8 characters long.'}), 400


        cursor = conn.cursor()

        # Check for duplicates
        user_name_duplicate_query_check = """
            SELECT COUNT(id) AS count 
            FROM user_master where username = ? and is_deleted  = 0
        """

        cursor.execute(user_name_duplicate_query_check, (new_username))
        user_name_result = cursor.fetchone()

        # debug
        # print (user_name_result)
        # print (access_level_result)
    
        if user_name_result is not None and user_name_result[0] != 0:
            return jsonify({'message': 'Error: Username is already exist'}), 400


        def generate_salt_and_hashed_password(new_username, new_password):
            # Generate a salt
            salt = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(25))

            # Hash the password with the salt
            hashed_password = hashlib.sha512((new_password + salt).encode('utf-8')).hexdigest()

            return new_username, salt, hashed_password

        username, salt, hashed_password = generate_salt_and_hashed_password(new_username,new_password)




        # Construct the SQL query to insert username credential
        query = """
                INSERT INTO user_master(id, username, salt, password_hash, access_level, created_by, is_superadmin, created_date, is_deleted)
                VALUES (NEWID(), ?, ?, ?, ?, ?, '0', GETDATE(), '0');
                """



        # Execute the SQL query
        cursor.execute(query, (username, salt, hashed_password, new_access_level, user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data inserted.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
