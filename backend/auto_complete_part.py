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


@app.route('/api/auto_complete_part_no', methods=['GET'])
def get_auto_complete_part_no():
    search_term = request.args.get('term')  # Get the search term from the query parameters
    
    if search_term is None:
        return jsonify({'error': 'Search term not provided'})
    
    cursor = conn.cursor()
    
    # Construct the SQL query with the search term
    query = "SELECT top 5 id, part_no FROM part_master WHERE is_deleted = 0 and part_no LIKE ?"
    params = ('%' + search_term + '%',)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

@app.route('/api/auto_complete_part_name', methods=['GET'])
def get_auto_complete_part_name():
    selected_part_id= request.args.get('part_id')  # Get the selected value from the query parameters

    if selected_part_id is None:
        return jsonify({'error': 'Selected value not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT id, part_description FROM part_master WHERE is_deleted = 0 and id = ?"
    params = (selected_part_id,)
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
    
