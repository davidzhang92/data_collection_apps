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
                        SELECT DISTINCT part_id 
                            FROM endtest_defect_result_entry 
                            WHERE created_date BETWEEN CONVERT(datetime, CONVERT(date, GETDATE())) AND GETDATE() AND is_deleted = 0

                            UNION

                            SELECT DISTINCT part_id 
                            FROM vw_result_entry 
                            WHERE part_id IS NOT NULL
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
WITH endtest_defect AS (
            SELECT part_id, SUM(quantity) AS defect_quantity
            FROM endtest_defect_result_entry
            WHERE created_date BETWEEN CONVERT(datetime, CONVERT(date, GETDATE())) AND GETDATE() 
            AND is_deleted = 0
            GROUP BY part_id
        ),
        result_entry AS (
            SELECT 
                a.part_id, b.part_no, b.part_description,
                COUNT(CASE WHEN result = 'pass' THEN record_id END) AS pass_count,
                COUNT(CASE WHEN result = 'fail' THEN record_id END) AS fail_count,
                COUNT(record_id) AS total_count,
                process_type
            FROM vw_result_entry a
            LEFT JOIN part_master b ON a.part_id = b.id
            WHERE a.part_id IS NOT NULL 
            AND a.created_date BETWEEN CONVERT(datetime, CONVERT(date, GETDATE())) AND GETDATE() 
            AND b.is_deleted = 0
            GROUP BY a.part_id, b.part_no, b.part_description, process_type
        ),
        combined AS (
            SELECT 
                re.part_id, re.part_no, re.part_description,
                re.pass_count,
				re.fail_count + CASE WHEN re.process_type = 'endtest' THEN ISNULL(ed.defect_quantity, 0) ELSE 0 END AS fail_count,
				re.total_count + CASE WHEN re.process_type = 'endtest' THEN ISNULL(ed.defect_quantity, 0) ELSE 0 END AS total_count,
                re.process_type
            FROM result_entry re
            LEFT JOIN endtest_defect ed ON re.part_id = ed.part_id AND re.process_type = 'endtest'
            UNION ALL
            SELECT 
                ed.part_id, pm.part_no, pm.part_description,
                0 AS pass_count,
                ed.defect_quantity AS fail_count,
                ed.defect_quantity AS total_count,
                'endtest' AS process_type
            FROM endtest_defect ed
            INNER join part_master pm on ed.part_id=pm.id
			WHERE NOT EXISTS (
		    SELECT 1 FROM result_entry re 
		    WHERE re.part_id = ed.part_id AND re.process_type = 'endtest'
			)

        )
        SELECT 
            part_id, part_no, part_description, 
            SUM(pass_count) AS pass_count, 
            SUM(fail_count) AS fail_count, 
            SUM(total_count) AS total_count, 
            process_type 
        FROM combined
        GROUP BY part_id, part_no, part_description, process_type

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
