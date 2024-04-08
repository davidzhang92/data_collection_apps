from flask import Flask, request, jsonify
import pyodbc
from dbutils.pooled_db import PooledDB
from functools import wraps
import jwt
from secret_key import SECRET_KEY

app = Flask(__name__)

# Define your MS SQL Server connection details
# server = '192.168.100.121'
# database = 'DataCollection'
# username = 'sa'
# password = 'Cannon45!'

# Create a pool of connections
pool = PooledDB(
    creator=pyodbc,
    maxconnections=6,
    dsn='DataCollection',  # Use the DSN you've defined in your odbc.ini file
    UID = 'sa',
    PWD = 'Cannon45!'
)

conn = pool.connection()
cursor = conn.cursor()

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





# API endpoint to get parts
@app.route('/api/get_dashboard_part_id', methods=['GET'])
@token_required
def get_dashboard_part_id():
    try:
        # Execute the queries to retrieve parts id
        part_ids_query = """
       select distinct part_id from vw_result_entry where part_id is not null
        """

        cursor.execute(part_ids_query)
        rows = cursor.fetchall()

        # Convert the result into a list of dictionaries for JSON serialization
        results = []
        columns = [column[0] for column in cursor.description]

        for row in rows:
            results.append(dict(zip(columns, row)))


        return jsonify(results)
    
    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500



    
@app.route('/api/get_dashboard_part_detail_counts', methods=['GET'])
@token_required
def get_dashboard_part_detail_counts():
    try:
        # Execute the queries to retrieve pass and fail counts
        details_query = """
        SELECT 
            a.part_id, b.part_no, b.part_description,
            COUNT(CASE WHEN result = 'pass' THEN record_id END) AS pass_count,
            COUNT(CASE WHEN result = 'fail' THEN record_id END) AS fail_count,
            COUNT(record_id) AS total_count,
            process_type
        FROM vw_result_entry a
        LEFT join part_master b on a.part_id = b.id
        WHERE a.part_id is not null
        GROUP BY  a.part_id, b.part_no, b.part_description, process_type
        """


        cursor.execute(details_query)
        rows = cursor.fetchall()

        # Convert the result into a list of dictionaries for JSON serialization
        results = []
        columns = [column[0] for column in cursor.description]

        for row in rows:
            results.append(dict(zip(columns, row)))
            
        return jsonify(results)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
