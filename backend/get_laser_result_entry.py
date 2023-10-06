from flask import Flask, request, jsonify
import pyodbc
import datetime
import os
from openpyxl import load_workbook
import shutil

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

# --------------------
# API endpoint get all leaktest result entry
# --------------------
@app.route('/api/get_laser_result_entry', methods=['GET'])
def get_laser_result_entry():
    
        
    selected_part_id = request.args.get('search_part_id')  # Get the selected value from the query parameters
    selected_date_from = request.args.get('search_date_from')  # Get the selected value from the query parameters
    selected_date_to = request.args.get('search_date_to')  # Get the selected value from the query parameters

    # if selected_part_no is None:
    #     return jsonify({'error': 'Search parameters not provided'})
    

    cursor = conn.cursor()
    
    # Construct the SQL query to select all data from the leaktest result entry table
    query = "select a.serial_no, a.data_matrix, a.label_id from laser_result_entry a inner join part_master b on a.part_id = b.id WHERE 1=1"

    parameters = []

    if selected_part_id:
        query += " AND a.part_id = ?"
        parameters.append(f"%{selected_part_id}%")

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

    # Execute the SQL query and fetch data
    cursor = conn.cursor()
    cursor.execute(query)
    query_result = cursor.fetchall()

    # Load the Excel template
    template_path = r"C:\excel_import\laser_result_template.xlsx"
    if not os.path.exists(template_path):
        print(f"Error: Excel template '{template_path}' not found.")
    else:
        # Get the current date in 'yyyy-mm-dd' format
        current_date = datetime.datetime.now().strftime('%Y-%m-%d')

        # Append the date to the new Excel file name
        new_excel_path = f'C:\excel_import\laserResult_{current_date}.xlsx'
        shutil.copyfile(template_path, new_excel_path)

        # Load the new copy of the Excel workbook
        workbook = load_workbook(new_excel_path)

        # Select the worksheet in the workbook (you may need to specify the sheet name)
        worksheet = workbook.active

        # Start populating data in row 2 (A2, B2, C2, etc.) for each row of query result
        row_number = 2  # Start from row 2
        for row_data in query_result:
            # Column indices (0-based) for each column in the row
            column1_index = 0  # A2
            column2_index = 1  # B2
            column3_index = 2  # C2

            # Insert data into specific cell coordinates for the current row
            worksheet.cell(row=row_number, column=column1_index + 1, value=row_data[0])  # A2
            worksheet.cell(row=row_number, column=column2_index + 1, value=row_data[1])  # B2
            worksheet.cell(row=row_number, column=column3_index + 1, value=row_data[2])  # C2

            # Move to the next row
            row_number += 1

        # Save the modified workbook with data to the new file
        workbook.save(new_excel_path)

        print(f"Data has been populated in '{new_excel_path}'")

    response_data = {"query_result": query_result}

    return jsonify(response_data)  # Return a JSON response
    
if __name__ == '__main__':
    app.run()
    