from flask import Flask, request, jsonify, make_response
import pyodbc
import re
import hashlib
import jwt
import datetime


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
@app.route('/api/post-user-authentication', methods=['POST'])
def post_user_authentication():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        user_name = data['username']
        password = data['password']

        cursor = conn.cursor()

        def authenticate_user_password(stored_salt, stored_hashed_password, provided_password):
            # Compute the hash of the provided password with the stored salt
            computed_hash = hashlib.sha512((provided_password + stored_salt).encode('utf-8')).hexdigest()

            # Compare the computed hash with the stored hashed password
            return computed_hash == stored_hashed_password  # The provided password is correct


        # Construct the SQL query to retrieve salt, password_hash, and access_level for the user
        query = """
                select salt, password_hash, b.access_type from user_master a
				inner join access_level_master b on a.access_level=b.id
                where username = ? and is_deleted = 0
                """

        # Execute the SQL query
        cursor.execute(query, (user_name,))
        result = cursor.fetchone()  # fetchone() retrieves one record from the query result

        if result is not None:
            salt, password_hash, access_type = result  # Unpack the result into the variables
            if authenticate_user_password(salt, password_hash, password):

                # Generate JWT token

                access_token = jwt.encode({'user': user_name, 'access_level': access_type, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)}, SECRET_KEY, algorithm='HS256')
                refresh_token = jwt.encode({'user': user_name, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)}, SECRET_KEY, algorithm='HS256')


                # Create a response
                response = make_response(jsonify({'message': 'Login OK', 'access_token': access_token}), 200)

                # Set the refresh token as an HttpOnly cookie
                response.set_cookie('refreshToken', refresh_token, httponly=True, samesite='Strict')


                
                return response
            else:
                return jsonify({'message': 'Bad username or password'}), 400
        else:
            return jsonify({'message': 'No user found with the provided username.'}), 400
        
    
    except Exception as e:
        return jsonify({'message': 'Error occurred while attempting to authenticate, please try again.', 'error': str(e)}), 500
    


    