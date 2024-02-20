from flask import Flask, request, jsonify
import pyodbc
from functools import wraps
import jwt

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


@app.route('/api/post-part', methods=['POST'])
@token_required
def post_part():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_no = data['part_no']
        new_part_description = data['part_description']
        user_id = data['user_id']

        cursor = conn.cursor()

        # Check for duplicates
        part_no_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM part_master where part_no = ? and is_deleted  = 0
        """
        part_description_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM part_master where part_description = ? and is_deleted  = 0
        """
        cursor.execute(part_no_duplicate_query_check, (new_part_no))
        part_no_result = cursor.fetchone()
        cursor.execute(part_description_duplicate_query_check, (new_part_description))
        part_description_result = cursor.fetchone()

        # debug
        # print (part_no_result)
        # print (part_description_result)
    
        if part_no_result is not None and part_no_result[0] != 0 and part_description_result is not None and part_description_result[0] == 0:
            return jsonify({'message': 'Error: Part No. is already exist'}), 400
        elif part_no_result is not None and part_no_result[0] == 0 and part_description_result is not None and part_description_result[0] != 0:
            return jsonify({'message': 'Error: This Description is already used'}), 400
        elif part_no_result is not None and part_no_result[0] != 0 or part_description_result is not None and part_description_result[0] != 0:
            return jsonify({'message': 'Error: Data is a duplicate.'}), 400
        # Construct the SQL query to update the part_no and part_description for the given id
        query = "insert into part_master  (id, part_no, part_description, created_by, created_date, is_deleted) values (newid(),?, ?, ?, getdate(), 0)"


        # Execute the SQL query
        cursor.execute(query, (new_part_no, new_part_description, user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
