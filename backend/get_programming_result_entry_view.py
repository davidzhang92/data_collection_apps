from flask import Flask, request, jsonify
import pyodbc
import datetime

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

# --------------------
# API endpoint get all programming result entry
# --------------------
@app.route('/api/get_programming_result_entry_view', methods=['GET'])
def get_programming_result_entry_view():
    try:
        # Extract the page query parameter from the request
        page = int(request.args.get('page', 1))  # Default value is 1

        # Calculate the offset based on the page number
        offset = (page - 1) * 10

        cursor = conn.cursor()

        # Construct the SQL query to select data from the part_master table with OFFSET
        query = "SELECT a.id, b.part_no, a.serial_no, a.result, a.fail_current, a.fail_hr, a.fail_pairing, a.fail_bluetooth, a.fail_sleep_mode, a.fail_other, a.created_date FROM programming_result_entry a INNER JOIN part_master b ON a.part_id = b.id ORDER BY a.created_date DESC OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY"

        cursor.execute(query, (offset,))
        rows = cursor.fetchall()

        # Convert the result into a list of dictionaries for JSON serialization
        results = []
        columns = [column[0] for column in cursor.description]

        for row in rows:
            results.append(dict(zip(columns, row)))

        return jsonify(results)

    except Exception as e:
        return jsonify({'message': 'Error occurred while fetching data.', 'error': str(e)}), 500
# --------------------
# API endpoint filtering after clicking Search button
# --------------------

@app.route('/api/get_filter_search_programming_result_entry', methods=['GET'])
# def get_filter_search_programming_result_entry():
#     search_part_no = request.args.get('search_part_no')  # Get the selected value from the query parameters
#     search_date_from = request.args.get('search_date_from')  # Get the selected value for date_from
#     search_date_to = request.args.get('search_date_to')  # Get the selected value for date_to

#     if not search_part_no:
#         return jsonify({'error': 'Part number not provided'})

#     cursor = conn.cursor()
    # query = "SELECT a.id AS part_id, b.part_no, serial_no, result, a.fail_current, a.fail_hr, a.fail_pairing, a.fail_bluetooth, a.fail_sleep_mode, a.fail_other, a.created_date FROM programming_result_entry a INNER JOIN part_master b ON a.part_id = b.id WHERE b.part_no=?"
#     parameters = [f"%{search_part_no}%"]

#     if search_date_from:
#         query += " AND a.created_date >= ?"
#         parameters.append(datetime.datetime.strptime(search_date_from, '%Y-%m-%d').strftime('%Y-%m-%d'))

#     if search_date_to:
#         query += " AND a.created_date <= ?"
#         parameters.append(datetime.datetime.strptime(search_date_to, '%Y-%m-%d').strftime('%Y-%m-%d'))

#     query += " ORDER BY a.created_date DESC;"

#     cursor.execute(query, parameters)
#     rows = cursor.fetchall()

#     # Convert the result into a list of dictionaries for JSON serialization
#     results = []
#     columns = [column[0] for column in cursor.description]

#     for row in rows:
#         results.append(dict(zip(columns, row)))

def get_filter_search_programming_result_entry_view():
    selected_part_no = request.args.get('search_part_no')  # Get the selected value from the query parameters



    if selected_part_no is None :
        return jsonify({'error': 'Search parameters not provided'})
    
  
    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the part_master table
    query = "SELECT a.id AS part_id, b.part_no, serial_no, result, a.fail_current, a.fail_hr, a.fail_pairing, a.fail_bluetooth, a.fail_sleep_mode, a.fail_other, a.created_date FROM programming_result_entry a INNER JOIN part_master b ON a.part_id = b.id WHERE b.part_no=?;"

    # Construct the parameter values with wildcards
    part_no_param = f"%{selected_part_no}%"

    
    cursor.execute(query, (part_no_param,))
    rows = cursor.fetchall()
    
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))

    return jsonify(results)

if __name__ == '__main__':
    app.run()
    
