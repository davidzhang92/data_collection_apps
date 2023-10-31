from flask import Flask, request, jsonify
import pyodbc
import datetime

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
# API endpoint get all leaktest result entry
# --------------------
@app.route('/api/get_endtest_result_entry_view', methods=['GET'])
def get_endtest_result_entry_view():
    try:
        # Extract the page query parameter from the request
        page = int(request.args.get('page', 1))  # Default value is 1

        # Calculate the offset based on the page number
        offset = (page - 1) * 10

        cursor = conn.cursor()

        # Construct the SQL query to select data from the part_master table with OFFSET
        query = "select a.id as id, b.part_no, a.serial_no, a.data_matrix, a.created_date from endtest_result_entry a left join part_master b on a.part_id = b.id  where a.is_deleted='0' order by created_date desc OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY"

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

@app.route('/api/get_filter_search_endtest_result_entry_view', methods=['GET'])
def get_filter_search_endtest_result_entry_view():
        
    selected_part_no = request.args.get('search_part_no')  # Get the selected value from the query parameters
    selected_date_from = request.args.get('search_date_from')  # Get the selected value from the query parameters
    selected_date_to = request.args.get('search_date_to')  # Get the selected value from the query parameters

    # if selected_part_no is None:
    #     return jsonify({'error': 'Search parameters not provided'})
    

    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the leaktest result entry table
    query = "select a.id as id, b.part_no, a.serial_no, a.data_matrix, a.created_date from endtest_result_entry a left join part_master b on a.part_id = b.id WHERE 1=1"

    parameters = []

    if selected_part_no:
        query += " AND b.part_no like ?"
        parameters.append(f"%{selected_part_no}%")

    if selected_date_from:
        # Append the time '00:00:00' to the date
        date_from_with_time = f"{selected_date_from} 00:00:00"
        query += " AND a.created_date >= ?"
        parameters.append(datetime.datetime.strptime(date_from_with_time, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'))


    if selected_date_to:
        # Append the time '23:59:59' to the date
        date_to_with_time = f"{selected_date_to} 23:59:59"
        query += " AND a.created_date <= ?"
        parameters.append(datetime.datetime.strptime(date_to_with_time, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'))


    query += "  AND a.is_deleted = '0' ORDER BY a.created_date DESC;"

    # Construct the parameter values with wildcards
    cursor.execute(query, parameters)
    rows = cursor.fetchall()
    print(selected_date_from)
    print(selected_date_to)
    # Convert the result into a list of dictionaries for JSON serialization
    results = []
    columns = [column[0] for column in cursor.description]
    
    for row in rows:
        results.append(dict(zip(columns, row)))
    
    return jsonify(results)


    
if __name__ == '__main__':
    app.run()
    