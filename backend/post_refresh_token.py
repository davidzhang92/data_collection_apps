from flask import Flask, request, jsonify, make_response
import pyodbc
import re
import hashlib
import jwt
import datetime
from functools import wraps


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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        refresh_token = None

        
        if 'Authorization' in request.headers:
            refresh_token = request.headers['Authorization']


        if 'x-access-token' in request.headers:
            refresh_token = request.headers['x-access-token']

        if not refresh_token:
            return jsonify({'message': 'Session timed out, please login again.'}), 401

        try:
            data = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])
            # access_level = data.get('access_level')

            # if access_level not in ['read-only', 'operator', 'admin']:
            # if access_level not in ['read-only', 'operator', 'admin']:
            #     return jsonify({'message': 'Error: You don\'t have sufficient privilege to perform this action.'}), 403
            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Session timed out, please login again.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

@app.route('/refresh-token', methods=['POST'])
@token_required
def refresh_token():
    data_token = request.get_json()
    # Get the refresh token from the request
    refresh_token = data_token['refreshToken']

    # Verify the refresh token
    if refresh_token is not None:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY)
            user_name = payload['user']
                
            # Construct the SQL query to access_level for the user
            query = """
                    select b.access_type from user_master a
                    inner join access_level_master b on a.access_level=b.id
                    where username = ? and is_deleted = 0
                    """

            # Execute the SQL query
            cursor = conn.cursor()
            cursor.execute(query, (user_name,))
            result = cursor.fetchone()  

            access_type = result

        # Generate a new access token
            access_token = jwt.encode({'user': user_name, 'access_level': access_type, 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=15)}, SECRET_KEY)
            response = make_response(jsonify({'message': 'Access Token Renewal Successful/', 'access_token': access_token}), 200)


            return response
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Refresh token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token. Please log in again.'}), 401
    else:
        return jsonify({'message': 'No refresh token provided.'}), 400




    


