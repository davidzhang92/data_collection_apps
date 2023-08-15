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

# --------------------
# API endpoint search part_name with given part_no
# --------------------
@app.route('/api/auto_complete_filter_part_no', methods=['GET'])
def get_auto_complete_filter_part_no():
    # search_term = request.args.get('term')  # Get the search term from the query parameters
    search_term = request.args.get('search_part_no')  # Get the search term from the query parameters
    
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


@app.route('/api/auto_complete_filter_part_name_for_part_no', methods=['GET'])
def get_auto_complete_filter_part_name_for_part_no():
    selected_part_description = request.args.get('search_part_description')  # Get the selected value from the query parameters

    if selected_part_description is None:
        return jsonify({'error': 'Selected part_no not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT part_description FROM part_master WHERE part_no = ?"
    params = (selected_part_description,)

    cursor.execute(query, params)
    part_description = cursor.fetchone()

    if part_description:
        return jsonify({'part_description': part_description[0]})
    else:
        print(selected_part_description)
        return jsonify({'part_description': 'part_description not found'})
    


# --------------------
# API endpoint search part_no with given part_name
# --------------------
@app.route('/api/auto_complete_filter_part_name', methods=['GET'])
def get_auto_complete_filter_part_name():
    # search_term = request.args.get('term')  # Get the search term from the query parameters
    search_part_description= request.args.get('search_part_description')  # Get the search term from the query parameters
    
    if search_part_description is None:
        return jsonify({'error': 'Search part_description not provided'})
    
    cursor = conn.cursor()
    
    # Construct the SQL query with the search term
    query = "SELECT top 5 id, part_description FROM part_master WHERE is_deleted = 0 and part_description LIKE ?"
    params = ('%' + search_part_description + '%',)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)


@app.route('/api/auto_complete_filter_part_no_for_part_name', methods=['GET'])
def get_auto_complete_filter_part_no_for_part_name():
    selected_part_no = request.args.get('search_part_no')  # Get the selected value from the query parameters

    if selected_part_no is None:
        return jsonify({'error': 'Selected value not provided'})

    cursor = conn.cursor()

    # Construct the SQL query to get the description based on the selected value
    query = "SELECT part_no FROM part_master WHERE part_description LIKE ?"
    params = (selected_part_no,)

    cursor.execute(query, params)
    part_no = cursor.fetchone()

    if part_no:
        return jsonify({'part_no': part_no[0]})
    else:
        print(selected_part_no)
        return jsonify({'part_no': 'Part Number not found'})
    

# --------------------
# API endpoint filtering after clicking Search button
# --------------------

@app.route('/api/get-data', methods=['GET'])
def get_data():
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the part_master table
    query = "SELECT top 10 id, part_no, part_description, CASE WHEN modified_date >= created_date THEN modified_date ELSE created_date END AS latest_date FROM part_master WHERE is_deleted = 0;"
    
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
    
