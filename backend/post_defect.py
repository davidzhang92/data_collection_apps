from flask import Flask, request, jsonify
import pyodbc
from functools import wraps
import jwt
from secret_key import SECRET_KEY
import yaml
from pathlib import Path

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

# # Load config from YAML

current_file = Path(__file__).resolve()
project_root = current_file.parent.parent  

config_path = project_root /'configs'/'db_config.yml'


with open(config_path, 'r') as file:
    config = yaml.safe_load(file)


conn_str = (
    f"DRIVER={{{config['driver']}}};"
    f"SERVER={config['server']};"
    f"DATABASE={config['database']};"
    f"UID={config['uid']};"
    f"PWD={config['pwd']};"
    f"TrustServerCertificate={config['trust_server_certificate']};"

)

conn = pyodbc.connect(conn_str)

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

@app.route('/api/post-defect', methods=['POST'])
@token_required
def post_defect():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_defect_no = data['defect_no']
        new_defect_description = data['defect_description']
        user_id = data['user_id']

        cursor = conn.cursor()

        # Check for duplicates
        defect_no_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM defect_master where defect_no = ? and is_deleted  = 0
        """
        defect_description_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM defect_master where defect_description = ? and is_deleted  = 0
        """
        cursor.execute(defect_no_duplicate_query_check, (new_defect_no))
        defect_no_result = cursor.fetchone()
        cursor.execute(defect_description_duplicate_query_check, (new_defect_description))
        defect_description_result = cursor.fetchone()

        # debug
        # print (defect_no_result)
        # print (defect_description_result)
    
        if defect_no_result is not None and defect_no_result[0] != 0 and defect_description_result is not None and defect_description_result[0] == 0:
            return jsonify({'message': 'Error: defect No. is already exist'}), 400
        elif defect_no_result is not None and defect_no_result[0] == 0 and defect_description_result is not None and defect_description_result[0] != 0:
            return jsonify({'message': 'Error: This Description is already used'}), 400
        elif defect_no_result is not None and defect_no_result[0] != 0 or defect_description_result is not None and defect_description_result[0] != 0:
            return jsonify({'message': 'Error: Data is a duplicate.'}), 400
        # Construct the SQL query to update the defect_no and defect_description for the given id
        query = "insert into defect_master  (id, defect_no, defect_description, created_by, created_date, is_deleted) values (newid(), ?, ?, ?, getdate(), 0)"


        # Execute the SQL query
        cursor.execute(query, (new_defect_no, new_defect_description, user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
