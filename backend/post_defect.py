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


@app.route('/api/post-defect', methods=['POST'])
def post_defect():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        new_defect_no = data['defect_no']
        new_defect_description = data['defect_description']

        cursor = conn.cursor()

        # Check for duplicates
        defect_no_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM defect_master where defect_no = ? and is_deleted  = 0
        """
        defect_description_duplicate_query_check = """
            SELECT COUNT(id) AS count
            FROM defect_master where defect_description = ? and is_deleted  = 0
        """
        cursor.execute(defect_no_duplicate_query_check, (new_defect_no))
        defect_no_result = cursor.fetchone()
        cursor.execute(defect_description_duplicate_query_check, (new_defect_description))
        defect_description_result = cursor.fetchone()

        # debug
        # print (defect_no_result)
        # print (defect_description_result)
    
        if defect_no_result is not None and defect_no_result[0] != 0 and defect_description_result is not None and defect_description_result[0] == 0:
            return jsonify({'message': 'Error: defect No. is already exist'}), 400
        elif defect_no_result is not None and defect_no_result[0] == 0 and defect_description_result is not None and defect_description_result[0] != 0:
            return jsonify({'message': 'Error: This Description is already used'}), 400
        elif defect_no_result is not None and defect_no_result[0] != 0 or defect_description_result is not None and defect_description_result[0] != 0:
            return jsonify({'message': 'Error: Data is a duplicate.'}), 400
        # Construct the SQL query to update the defect_no and defect_description for the given id
        query = "insert into defect_master  (id, defect_no, defect_description, created_date, is_deleted) values (newid(), ?, ?, getdate(), 0)"

        # Construct the SQL query to update the defect_no and defect_description for the given id
        query = "insert into defect_master  (id, defect_no, defect_description, created_date, is_deleted) values (newid(), ?, ?, getdate(), 0)"


        # Execute the SQL query
        cursor.execute(query, (new_defect_no, new_defect_description))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404

        return jsonify({'message': 'Data updated successfully.'}), 200

    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
