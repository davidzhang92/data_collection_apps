from flask import Flask, request, jsonify
import pyodbc
import datetime
import time

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

def execute_query(query):
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()

def fetch_data(query):
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return rows

# --------------------
# API endpoint get overall throughput
# --------------------
@app.route('/api/get_overall_throughput', methods=['GET'])
def get_overall_throughput():
    try:

        # Execute the query to retrieve data from the overall_throughput table
        query = """
        SELECT distinct created_date, total_entries
        FROM overall_throughput
        WHERE created_date >= DATEADD(HOUR, -8, GETDATE())
          AND created_date <= GETDATE();
        """
        rows = fetch_data(query)

        # Prepare the data as an array of objects
        results = [{'created_date': row.created_date, 'total_entries': row.total_entries} for row in rows]

        return jsonify(results)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
