from flask import Flask, request, jsonify
import pyodbc
import uuid

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


@app.route('/api/post-oqc-result-entry', methods=['POST'])
def post_oqc_result_entry():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_id = uuid.UUID(data['part_id'])
        new_serial_no = str(data['serial_no'])

        # Concatenate part_id and serial_no
        concatenated_values = str(new_part_id) + new_serial_no

        cursor = conn.cursor()

        # Check for duplicates based on the concatenated values
        duplicate_check_query = """
            SELECT COUNT(*) AS count
            FROM oqc_result_entry
            WHERE CONCAT(part_id, serial_no) = ?
            AND is_deleted = 0;
        """
        cursor.execute(duplicate_check_query, (concatenated_values,))
        result = cursor.fetchone()

        if result is not None:
            duplicate_count = result[0]
        else:
            duplicate_count = 0

        if duplicate_count > 0:
            return jsonify({'message': 'Data is a duplicate.'}), 400

        # If no duplicates, insert the data
        new_part_id = uuid.UUID(data['part_id'])
        new_result = str(data['result'])
        new_serial_no = str(data['serial_no'])
        defect_id_param = uuid.UUID(data['defect_id']) if data['defect_id'].strip() else None
        
        # Construct the SQL query to insert the data
        if defect_id_param is None:
            insert_query = """
                insert into oqc_result_entry (id, part_id, result, serial_no, created_date, is_deleted)
                values (NEWID(),?,?,?, GETDATE(), 0)
            """
            cursor.execute(insert_query, (new_part_id, new_result, new_serial_no))
        else:
            insert_query = """
                insert into oqc_result_entry (id, part_id, defect_id, result, serial_no, created_date, is_deleted)
                values (NEWID(),?,?,?,?, GETDATE(), 0)
            """
            cursor.execute(insert_query, (new_part_id, defect_id_param, new_result, new_serial_no))

        conn.commit()

        return jsonify({'message': 'Data inserted successfully.'}), 200

    except Exception as e:
        error_message = f'Error occurred while inserting data: {str(e)}'
        print(error_message)  # Print the error message to your server's log
        return jsonify({'message': error_message}), 500


if __name__ == '__main__':
    app.run()
