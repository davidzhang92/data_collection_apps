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


@app.route('/api/auto_complete_defect_no', methods=['GET'])
def get_auto_complete_defect_no():
    search_term = request.args.get('term')  # Get the search term from the query parameters
    
    if search_term is None:
        return jsonify({'error': 'Search term not provided'})
    
    cursor = conn.cursor()
    
    # Construct the SQL query with the search term
    query = "SELECT top 5 id, defect_no FROM defect_master WHERE is_deleted = 0 and defect_no LIKE ?"
    params = ('%' + search_term + '%',)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

@app.route('/api/auto_complete_defect_name', methods=['GET'])
def get_auto_complete_defect_name():
    selected_defectCodeField = request.args.get('defectCodeField')  # Get the selected value from the query parameters

    if selected_defectCodeField is None:
        return jsonify({'error': 'Selected value not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT id, defect_description FROM defect_master WHERE defect_no = ?"
    params = (selected_defectCodeField,)
    cursor.execute(query, params)
    rows = cursor.fetchall()

    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

if __name__ == '__main__':
    app.run()
    
