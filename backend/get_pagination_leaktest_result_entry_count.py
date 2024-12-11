from flask import Flask, request, jsonify
import pyodbc

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


# retrieve number of data in the table
@app.route('/api/get_pagination_leaktest_result_entry_count', methods=['POST'])
def get_pagination_leaktest_result_entry_count():

    data = request.get_json()
    leaktest_type = str(data['leaktest_type']).upper()
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the part_master table
    query = "select count(id) from leaktest_result_entry where is_deleted = 0 and leaktest_type = ?"
    
    cursor.execute(query, (leaktest_type,))
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []

    for row in rows:
            entry = {"count": row[0]}  # Use a meaningful key like "count"
            results.append(entry)
        
    return jsonify(results)

    

if __name__ == '__main__':
    app.run()
    
