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

# retrieve number of data in the table
@app.route('/api/get_pagination_defect_entries', methods=['GET'])
def get_pagination_defect_entries():
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the defect_master table
    query = "select count(id) from defect_master where is_deleted = 0"
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []

    for row in rows:
            entry = {"count": row[0]}  # Use a meaningful key like "count"
            results.append(entry)
        
    return jsonify(results)

    

if __name__ == '__main__':
    app.run()
    
