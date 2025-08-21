from flask import Flask, request, jsonify
import pyodbc
import yaml
from pathlib import Path

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

# # Load config from YAML

current_file = Path(__file__).resolve()
project_root = current_file.parent.parent  

config_path = project_root /'configs'/'db_config.yml'


with open(config_path, 'r') as file:
    config = yaml.safe_load(file)


conn_str = (
    f"DRIVER={{{config['driver']}}};"
    f"SERVER={config['server']};"
    f"DATABASE={config['database']};"
    f"UID={config['uid']};"
    f"PWD={config['pwd']};"
    f"TrustServerCertificate={config['trust_server_certificate']};"

)

conn = pyodbc.connect(conn_str)



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
    query = """SELECT a.id, a.username, b.access_type, c.username AS created_by_username, 
                CASE 
                    WHEN a.modified_date >= a.created_date THEN a.modified_date 
                    ELSE a.created_date 
                END AS latest_date, 
                a.last_login 
                FROM user_master a 
                INNER JOIN access_level_master b ON a.access_level=b.id
                INNER JOIN user_master c ON a.created_by = c.id
                WHERE a.username LIKE ?  
                AND b.access_type LIKE ? 
                AND a.is_deleted='0' 
                ORDER BY latest_date DESC"""

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
    
