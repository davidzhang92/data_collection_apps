from flask import Flask, request, jsonify
import pyodbc
import uuid

app = Flask(__name__)

# Define your MS SQL Server connection details
server = '192.168.100.90'
database = 'DataCollection'
username = 'sa'
password = 'Cannon45!'

# Establish the connection
conn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)

@app.route('/api/post-leaktest-result-entry', methods=['POST'])
def post_leaktest_result_entry():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_part_id = uuid.UUID(data['part_id'])
        new_housing_no = str(data['housing_no'])

        # Concatenate part_id and serial_no
        concatenated_values = str(new_part_id) + new_housing_no

        cursor = conn.cursor()

        # Check for duplicates based on the concatenated values
        duplicate_check_query = """
            SELECT COUNT(*) AS count
            FROM leaktest_result_entry
            WHERE CONCAT(part_id, housing_no) = ?
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
        new_housing_no = str(data['housing_no'])
        new_result = str(data['result'])
        new_fine_value = float(data['fine_value'])
        new_gross_value = float(data['gross_value'])
        new_others_value = float(data['others_value'])


        # Construct the SQL query to insert the data
        insert_query = """
        insert into leaktest_result_entry (id, part_id, housing_no, result, fine_value, gross_value, others_value, created_date, is_deleted)
        values (newid(),?,?,?,?,?,?, GETDATE(), 0)
        """

        # Execute the SQL query to insert the data
        cursor.execute(insert_query, (new_part_id, new_housing_no, new_result, new_fine_value, new_gross_value, new_others_value))
        conn.commit()

        return jsonify({'message': 'Data inserted successfully.'}), 200

    except Exception as e:
        error_message = f'Error occurred while inserting data: {str(e)}'
        print(error_message)  # Print the error message to your server's log
        return jsonify({'message': error_message}), 500

if __name__ == '__main__':
    app.run()
