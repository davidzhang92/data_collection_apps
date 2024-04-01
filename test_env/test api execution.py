from flask import Flask, request, jsonify
import pyodbc
from dbutils.pooled_db import PooledDB
from functools import wraps
import jwt
import json



pool = PooledDB(
    creator=pyodbc,
    maxconnections=6,
    dsn='DataCollection',  # Use the DSN you've defined in your odbc.ini file
    UID = 'sa',
    PWD = 'Cannon45!'
)
conn = pool.connection()
cursor = conn.cursor()

def get_part_id():
    try:

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
        
        # print (rows)
        return json.dumps(results)
    
    except Exception as e:
        return json.dumps({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500
        

print(get_part_id())