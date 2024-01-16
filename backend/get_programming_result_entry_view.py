from flask import Flask, request, jsonify
import pyodbc
import datetime
from io import BytesIO
from openpyxl import load_workbook  # Import openpyxl

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
        query = "SELECT a.id, b.part_no, a.serial_no, a.result, a.fail_current, a.fail_hr, a.fail_pairing, a.fail_bluetooth, a.fail_sleep_mode, a.fail_other, a.created_date FROM programming_result_entry a INNER JOIN part_master b ON a.part_id = b.id WHERE a.is_deleted = '0' ORDER BY a.created_date DESC OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY"

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

@app.route('/api/get_filter_search_programming_result_entry_view', methods=['GET'])
def get_filter_search_programming_result_entry_view():
        
    selected_part_no = request.args.get('search_part_no')  # Get the selected value from the query parameters
    selected_date_from = request.args.get('search_date_from')  # Get the selected value from the query parameters
    selected_date_to = request.args.get('search_date_to')  # Get the selected value from the query parameters

    # if selected_part_no is None:
    #     return jsonify({'error': 'Search parameters not provided'})
    

    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the programming result entry table
    query = "SELECT a.id AS id, b.part_no, serial_no, result, a.fail_current, a.fail_hr, a.fail_pairing, a.fail_bluetooth, a.fail_sleep_mode, a.fail_other, a.created_date FROM programming_result_entry a INNER JOIN part_master b ON a.part_id = b.id WHERE 1=1"

    parameters = []

    if selected_part_no:
        query += " AND b.part_no LIKE ?"
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


# --------------------
# API endpoint download view result
# --------------------
@app.route('/api/get_laser_result_entry', methods=['POST'])
def get_laser_result_entry():
    # Define the path to the Excel template (modify this path accordingly)
    template_path = r'/data-storage/sfdc_apps/excel_import/laser_result_template.xlsx'

    try:
        # Try to parse JSON data from the request body
        request_data = request.get_json()

        # Check if request_data is None or not a dictionary
        if request_data is None or not isinstance(request_data, dict):
            return jsonify({'error': 'Invalid JSON data in the request body.'}), 400

        # Get the search parameters from the JSON data
        selected_part_id = request_data.get('part_id')
        selected_date_from = request_data.get('date_from')
        selected_date_to = request_data.get('date_to')

        # Check if required parameters are provided
        if not selected_part_id and not selected_date_from and not selected_date_to:
            return jsonify({'error': 'Missing required parameters. Please provide at least one search parameter.'}), 400

        cursor = conn.cursor()

        # Construct the SQL query to select data based on the provided parameters
        query = "SELECT a.serial_no, a.data_matrix, a.label_id FROM laser_result_entry a INNER JOIN part_master b ON a.part_id = b.id WHERE 1=1"
        parameters = []

        if selected_part_id:
            query += " AND a.part_id = ?"
            parameters.append(selected_part_id)

        if selected_date_from:
            date_from_with_time = f"{selected_date_from} 00:00:00"
            query += " AND a.created_date >= ?"
            parameters.append(datetime.datetime.strptime(date_from_with_time, '%Y-%m-%d %H:%M:%S'))

        if selected_date_to:
            date_to_with_time = f"{selected_date_to} 23:59:59"
            query += " AND a.created_date <= ?"
            parameters.append(datetime.datetime.strptime(date_to_with_time, '%Y-%m-%d %H:%M:%S'))

        query += "  AND a.is_deleted = '0' ORDER BY a.created_date DESC;"

        # Execute the SQL query and fetch data
        cursor.execute(query, parameters)
        query_result = cursor.fetchall()

  # Load the Excel template
        workbook = load_workbook(template_path)
        worksheet = workbook.active

      
        row_number = 2  # Start from row 2

        for row_data in query_result:
           
            column1_index = 1  # Column A
            column2_index = 2  # Column B
            column3_index = 3  # Column C

            worksheet.cell(row=row_number, column=column1_index, value=row_data[0])  
            worksheet.cell(row=row_number, column=column2_index, value=row_data[1]) 
            worksheet.cell(row=row_number, column=column3_index, value=row_data[2]) 

            row_number += 1

        # Save the modified workbook in memory
        excel_output = BytesIO()
        workbook.save(excel_output)
        excel_output.seek(0)

        # Send the modified Excel file as a binary attachment
        return Response(
            excel_output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={
                'Content-Disposition': 'attachment; filename=laser_result.xlsx'
            }
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run()
    