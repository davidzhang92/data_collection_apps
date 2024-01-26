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


@app.route('/refresh-token', methods=['POST'])
def refresh_token():
    # Get the refresh token from the request
    refresh_token = request.headers.get('Authorization')

    # Verify the refresh token
    if refresh_token is not None:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY)
            user_name = payload['user']
        # Generate a new access token
            new_access_token = jwt.encode({'user': user_name, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)}, SECRET_KEY)

            return jsonify({'access_token': new_access_token}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Refresh token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token. Please log in again.'}), 401
    else:
        return jsonify({'message': 'No refresh token provided.'}), 400


    


