from flask import Flask, request, jsonify
import pyodbc
import datetime
import time
from secret_key import SECRET_KEY
import jwt
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
            if access_level not in ['read-only', 'operator', 'admin']:
                return jsonify({'message': 'Error: You don\'t have sufficient privilege to perform this action.'}), 403
            
        except Exception as e:
            print(e)
            return jsonify({'message': 'Session timed out, please login again.', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

def fetch_data(query):
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return rows


# --------------------
# API endpoint get overall throughput
# --------------------
@app.route('/api/get_overall_throughput', methods=['GET'])
# @token_required
def get_overall_throughput():
    try:

        # Execute the query to retrieve data from the overall_throughput table
        query = """
        SELECT distinct created_date, programming_entries,	leaktest_entries, endtest_entries, laser_entries, oqc_entries, total_entries
        FROM overall_throughput
        WHERE created_date >= DATEADD(HOUR, -8, GETDATE())
          AND created_date <= GETDATE();
        """
        rows = fetch_data(query)

        # Prepare the data as an array of objects
        results = [{'created_date': row.created_date, 
                    'programming_entries':row.programming_entries, 
                    'leaktest_entries':row.leaktest_entries, 
                    'endtest_entries':row.endtest_entries, 
                    'laser_entries':row.laser_entries, 
                    'oqc_entries':row.oqc_entries, 
                    'total_entries': row.total_entries} 
                    
                    for row in rows]

        return jsonify(results)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
