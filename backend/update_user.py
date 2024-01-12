from flask import Flask, request, jsonify
import pyodbc
import uuid
import re

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


@app.route('/api/update-user', methods=['PATCH'])
def update_user():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload

        new_username = str(data['username'])
        new_access_level = uuid.UUID(data['access_level'])
        user_id = uuid.UUID(data['id'])



        cursor = conn.cursor()

        # Construct the SQL query to update the part_no and part_description for the given id
        query = "update user_master set username = ?, access_level = ?, modified_date = getdate() where id = ?"

        # Execute the SQL query
        cursor.execute(query, ( new_username, new_access_level, user_id))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        # Construct and execute the query to fetch updated data
        success_output_query = "select a.id, a.username, b.access_type, a.modified_date from user_master a inner join access_level_master b on a.access_level=b.id and a.id = ? where a.is_deleted = 0"

        cursor.execute(success_output_query, (user_id,))
        updated_data_row  = cursor.fetchone()
        if updated_data_row:
            updated_data = {
                'id': updated_data_row[0],
                'username': updated_data_row[1],
                'access_level': updated_data_row[2],
                'modified_date': updated_data_row[3],
                # '(debug) raw_data_row': list(updated_data_row)  # Include the raw data row here
            }
            return jsonify(updated_data), 200
        else:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        
    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500


@app.route('/api/update-user-password', methods=['PATCH'])
def update_user_password():
    try:
        # Get data from the request payload
        data = request.get_json()

        # Extract required fields from the payload
        user_id = uuid.UUID(data['id'])
        new_password = str(data['password'])

        # Password complexity check
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$', new_password):
            return jsonify({'message': 'Error: Password must be at least 8 characters long, contain at least one capital letter and one number'}), 400
    
        cursor = conn.cursor()

        # Construct the SQL query to update the part_no and part_description for the given id
        query = """
                DECLARE @Password NVARCHAR(MAX);
                DECLARE @Salt VARCHAR(MAX);
                DECLARE @HashedPassword VARBINARY(MAX);
                DECLARE @AccessLevel uniqueidentifier;
                DECLARE @id uniqueidentifier;

                SET @id = ?
                SET @Password = ?

				DECLARE @Username NVARCHAR(MAX);
				SELECT @Username = username FROM user_master WHERE id=@id;


                EXEC HashPassword @Username, @Password, @Salt = @Salt OUTPUT, @HashedPassword = @HashedPassword OUTPUT;

                update user_master
                set 
                salt = @Salt,
                password_hash = @HashedPassword,
                modified_date = GETDATE(),
                last_password_change = GETDATE()
                where id = @id
                """


        # Execute the SQL query
        cursor.execute(query, (user_id,new_password))
        conn.commit()

        # Check if any rows were affected by the update operation
        if cursor.rowcount == 0:
            return jsonify({'message': 'No data found for the given id.'}), 404
        
        # Construct and execute the query to fetch updated data
        success_output_query = "select id, username, access_level, modified_date from user_master where is_deleted = 0 and id = ?"

        cursor.execute(success_output_query, (user_id,))
        updated_data_row  = cursor.fetchone()
        if updated_data_row:
            updated_data = {
                'id': updated_data_row[0],
                'username': updated_data_row[1],
                'access_level': updated_data_row[2],
                'modified_date': updated_data_row[3],
                # '(debug) raw_data_row': list(updated_data_row)  # Include the raw data row here
            }
            return jsonify(updated_data), 200
        else:
            return jsonify({'message': 'No data found for the given id.'}), 404


    except Exception as e:
        return jsonify({'message': 'Error occurred while updating data.', 'error': str(e)}), 500
