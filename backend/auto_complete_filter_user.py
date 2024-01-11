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



@app.route('/api/auto_complete_filter_user_name', methods=['GET'])
def get_auto_complete_filter_user_name():
    # search_term = request.args.get('term')  # Get the search term from the query parameters
    search_term = request.args.get('search_username')  # Get the search term from the query parameters
    
    if search_term is None:
        return jsonify({'error': 'Search term not provided'})
    
    cursor = conn.cursor()
    
    # Construct the SQL query with the search term
    query = "SELECT top 5 id, username FROM user_master WHERE is_deleted = 0 and username LIKE ?"
    params = ('%' + search_term + '%',)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

# --------------------
# API endpoint filtering after clicking Search button
# --------------------

@app.route('/api/filter_search_user_master', methods=['GET'])
def get_filter_search_user_master():
    search_username = request.args.get('search_username')  # Get the selected value from the query parameters
    search_user_access_level = request.args.get('search_user_access_level')  # Get the selected value for part description


    if search_username is None and search_user_access_level is None:
        return jsonify({'error': 'Search parameters not provided'})
    
  
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the part_master table
    query = "select a.id, username, b.access_type, CASE WHEN a.modified_date >= a.created_date THEN a.modified_date ELSE a.created_date END AS latest_date, last_login from user_master a inner join access_level_master b on a.access_level=b.id where username LIKE ?  and b.access_type LIKE ? and is_deleted='0' order by latest_date desc;"

    # Construct the parameter values with wildcards
    username_param = f"%{search_username}%"
    user_access_level_param = f"%{search_user_access_level}%"

    
    cursor.execute(query, (username_param, user_access_level_param))
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

if __name__ == '__main__':
    app.run()
    
