from flask import Flask, request, jsonify
import pyodbc

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

@app.route('/api/get-data', methods=['GET'])
def get_data():
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the part_master table
    query = "select id, part_no, part_description, created_date from part_master where is_deleted = 0"
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

    

if __name__ == '__main__':
    app.run()
    
