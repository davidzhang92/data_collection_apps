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


# --------------------
# API endpoint search defect_name with given defect_no
# --------------------
@app.route('/api/auto_complete_filter_defect_no', methods=['GET'])
def get_auto_complete_filter_defect_no():
    # search_term = request.args.get('term')  # Get the search term from the query parameters
    search_term = request.args.get('search_defect_no')  # Get the search term from the query parameters
    
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


@app.route('/api/auto_complete_filter_defect_name_for_defect_no', methods=['GET'])
def get_auto_complete_filter_defect_name_for_defect_no():
    selected_defect_description = request.args.get('search_defect_description')  # Get the selected value from the query parameters

    if selected_defect_description is None:
        return jsonify({'error': 'Selected defect_no not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT defect_description FROM defect_master WHERE defect_no = ?"
    params = (selected_defect_description,)

    cursor.execute(query, params)
    defect_description = cursor.fetchone()

    if defect_description:
        return jsonify({'defect_description': defect_description[0]})
    else:
        print(selected_defect_description)
        return jsonify({'defect_description': 'defect_description not found'})
    


# --------------------
# API endpoint search defect_no with given defect_name
# --------------------
@app.route('/api/auto_complete_filter_defect_name', methods=['GET'])
def get_auto_complete_filter_defect_name():
    # search_term = request.args.get('term')  # Get the search term from the query parameters
    search_defect_description= request.args.get('search_defect_description')  # Get the search term from the query parameters
    
    if search_defect_description is None:
        return jsonify({'error': 'Search defect_description not provided'})
    
    cursor = conn.cursor()
    
    # Construct the SQL query with the search term
    query = "SELECT top 5 id, defect_description FROM defect_master WHERE is_deleted = 0 and defect_description LIKE ?"
    params = ('%' + search_defect_description + '%',)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)


@app.route('/api/auto_complete_filter_defect_no_for_defect_name', methods=['GET'])
def get_auto_complete_filter_defect_no_for_defect_name():
    selected_defect_no = request.args.get('search_defect_no')  # Get the selected value from the query parameters

    if selected_defect_no is None:
        return jsonify({'error': 'Selected value not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT defect_no FROM defect_master WHERE defect_description LIKE ?"
    params = (selected_defect_no,)

    cursor.execute(query, params)
    defect_no = cursor.fetchone()

    if defect_no:
        return jsonify({'defect_no': defect_no[0]})
    else:
        print(selected_defect_no)
        return jsonify({'defect_no': 'defect Number not found'})
    

# --------------------
# API endpoint filtering after clicking Search button
# --------------------

@app.route('/api/filter_search_defect_master', methods=['GET'])
def get_filter_search_defect_master():
    selected_defect_no = request.args.get('search_defect_no')  # Get the selected value from the query parameters
    selected_defect_description = request.args.get('search_defect_description')  # Get the selected value for defect description


    if selected_defect_no is None and selected_defect_description is None:
        return jsonify({'error': 'Search parameters not provided'})
    
  
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the defect_master table
    query = "SELECT  id, defect_no, defect_description, CASE WHEN modified_date >= created_date THEN modified_date ELSE created_date END AS latest_date FROM defect_master WHERE  defect_no LIKE ? and defect_description LIKE ? and is_deleted = 0 Order by latest_date desc;"

    # Construct the parameter values with wildcards
    defect_no_param = f"%{selected_defect_no}%"
    defect_description_param = f"%{selected_defect_description}%"

    
    cursor.execute(query, (defect_no_param, defect_description_param))
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)

if __name__ == '__main__':
    app.run()
    
