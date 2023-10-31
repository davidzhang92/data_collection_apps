from flask import Flask, request, jsonify
import pyodbc
from dbutils.pooled_db import PooledDB

app = Flask(__name__)

# Define your MS SQL Server connection details (Windows)
# server = '192.168.100.121'
# database = 'DataCollection'
# username = 'sa'
# password = 'Cannon45!'

# # Create a pool of connections
# pool = PooledDB(
#     creator=pyodbc,
#     maxconnections=6,
#     user=username,
#     password=password,
#     database=database,
#     host=server,
#     driver='{SQL Server}'
# )

# Define your MS SQL Server connection details (Linux)
# Create a pool of connections
pool = PooledDB(
    creator=pyodbc,
    maxconnections=6,
    dsn='DataCollection',  # Use the DSN you've defined in your odbc.ini file
    UID = 'sa',
    PWD = 'Cannon45!'
)

def fetch_data_details(query):
    conn = pool.connection()
    cursor = conn.cursor()
    cursor.execute(query)
    row = cursor.fetchone()
    conn.close()
    return row if row else None  # Return None when there's no data

def fetch_data_donut(query):
    conn = pool.connection()
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchone()  # We expect a single result, so fetch one row
    conn.close()
    return rows[0] if rows else 0

# API endpoint to get pass and fail counts
@app.route('/api/get_donut_3', methods=['GET'])
def get_donut_3():
    try:
        # Execute the queries to retrieve pass and fail counts
        pass_query = """
        SELECT COUNT(id) 
        FROM endtest_result_entry 
        WHERE is_deleted = 0 
            AND CAST(created_date AS DATE) = CAST(GETDATE() AS DATE)
            AND part_id = (SELECT TOP 1 part_id FROM endtest_result_entry ORDER BY created_date DESC);
        """

        # fail_query = """
        # SELECT COUNT(id) 
        # FROM endtest_result_entry 
        # WHERE is_deleted = 0 
        #     AND CAST(created_date AS DATE) = CAST(GETDATE() AS DATE)
        #     AND part_id = (SELECT TOP 1 part_id FROM endtest_result_entry ORDER BY created_date DESC);
        # """

        pass_count = fetch_data_donut(pass_query)
        # fail_count = fetch_data_donut(fail_query)

        # Prepare the data as a JSON object
        result = {'pass': pass_count}
        # result = {'pass': pass_count, 'fail': fail_count}

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500



    
@app.route('/api/get_donut_3_details', methods=['GET'])

def get_donut_3_details():
    try:
        # Execute the queries to retrieve pass and fail counts
        details_query = """
        SELECT top 1 b.part_description, b.part_no FROM endtest_result_entry  a
        inner join part_master b on a.part_id = b.id

        WHERE a.is_deleted = 0 
            AND CAST(a.created_date AS DATE) = CAST(GETDATE() AS DATE)
            AND a.part_id = (SELECT TOP 1 a.part_id FROM endtest_result_entry order by a.created_date desc) order by a.created_date desc
        """


        details = fetch_data_details(details_query)
        print(details)  # For debugging, remove it in production

        #  Prepare the data as a JSON object
        if details:
            result = {
                'part_description': details[0],
                'part_no': details[1]
            }
        else:
            result = {
                'message': 'No data found'
            }

        return jsonify(result)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
