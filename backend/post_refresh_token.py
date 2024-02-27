from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pyodbc
import jwt
from datetime import datetime, timedelta
import pytz
from functools import wraps
from secret_key import SECRET_KEY


app = Flask(__name__)
CORS(app)

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
        provided_access_token = None

        print(request.headers['Authorization'])
        if 'Authorization' in request.headers:
            provided_access_token = request.headers['Authorization']


        if 'x-access-token' in request.headers:
            provided_access_token = request.headers['x-access-token']

        if not provided_access_token:
            return jsonify({'message': 'Token invalid, please login again.'}), 401

        try:
            data = jwt.decode(provided_access_token, SECRET_KEY, algorithms=['HS256'])


            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Invalid Session, please login again.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

@app.route('/refresh-access-token', methods=['POST'])
@token_required
def post_refresh_access_token():
    cursor = conn.cursor()
    old_access_token = request.headers.get('Authorization')

    # Verify the refresh token
    if old_access_token is not None:
        try:
            payload = jwt.decode(old_access_token, SECRET_KEY, algorithms=['HS256'])
            current_user_name = payload.get('user')
            exp = datetime.utcnow().replace(tzinfo=pytz.UTC).astimezone(pytz.timezone('Asia/Jakarta')) + timedelta(hours=2)

                
            # Construct the SQL query to access_level for the user
            query = """
                    select a.id, b.access_type from user_master a
                    inner join access_level_master b on a.access_level=b.id
                    where username = ? and is_deleted = 0
                    """

            # Execute the SQL query

            cursor.execute(query, (current_user_name))
            result = cursor.fetchone()  
    
    
            if result is not None:
                user_id, access_type = result
            else:
                return jsonify({'message': 'Error: No valid access level is found.'}), 401


        # Generate a new access token

            access_token = jwt.encode({'user': current_user_name, 'access_level': access_type, 'exp': exp }, SECRET_KEY)
            response = make_response(jsonify({'message': 'Access Token Renewal Successful', 'access_token': access_token, 'username':current_user_name, 'user_id':user_id }), 200)


            return response
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError as jwt_error:
            return jsonify({str(jwt_error)}), 401
    else:
        return jsonify({'message': 'No token provided.'}), 400




